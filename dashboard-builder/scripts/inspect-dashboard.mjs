#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

function parseArgs(argv) {
  const args = {
    viewport: "1920x1080",
    out: "dashboard-inspection.json",
    screenshot: "dashboard-inspection.png",
    wait: 1200,
  };

  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    const next = argv[index + 1];
    if (arg === "--file") {
      args.file = next;
      index += 1;
    } else if (arg === "--url") {
      args.url = next;
      index += 1;
    } else if (arg === "--viewport") {
      args.viewport = next;
      index += 1;
    } else if (arg === "--out") {
      args.out = next;
      index += 1;
    } else if (arg === "--screenshot") {
      args.screenshot = next;
      index += 1;
    } else if (arg === "--wait") {
      args.wait = Number(next);
      index += 1;
    } else if (arg === "--help") {
      args.help = true;
    }
  }

  return args;
}

function usage() {
  return `Usage:
  node scripts/inspect-dashboard.mjs --file path/to/dashboard.html
  node scripts/inspect-dashboard.mjs --url http://localhost:5173

Options:
  --viewport 1920x1080
  --out report.json
  --screenshot screenshot.png
  --wait 1200`;
}

function parseViewport(value) {
  const match = /^(\d+)x(\d+)$/.exec(value);
  if (!match) {
    throw new Error(`Invalid viewport "${value}". Use WIDTHxHEIGHT, for example 1920x1080.`);
  }
  return { width: Number(match[1]), height: Number(match[2]) };
}

async function loadPlaywright() {
  try {
    const module = await import("playwright");
    return module.chromium ? module : module.default;
  } catch (error) {
    const require = createRequire(import.meta.url);
    const searchPaths = [
      process.cwd(),
      ...((process.env.NODE_PATH || "").split(path.delimiter).filter(Boolean)),
    ];
    try {
      const resolved = require.resolve("playwright", { paths: searchPaths });
      const module = await import(pathToFileURL(resolved).href);
      return module.chromium ? module : module.default;
    } catch {
      throw new Error(`Playwright is required. Install it in the project, set NODE_PATH to a node_modules directory that contains it, then rerun this script. Original error: ${error.message}`);
    }
  }
}

function overlapArea(a, b) {
  const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return x * y;
}

function issue(severity, code, message, evidence = {}) {
  return { severity, code, message, evidence };
}

const args = parseArgs(process.argv);

if (args.help || (!args.file && !args.url) || (args.file && args.url)) {
  console.log(usage());
  process.exit(args.help ? 0 : 2);
}

const viewport = parseViewport(args.viewport);
const target = args.url || pathToFileURL(path.resolve(args.file)).href;
const { chromium } = await loadPlaywright();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport });
const consoleMessages = [];
const pageErrors = [];

page.on("console", (message) => {
  consoleMessages.push({ type: message.type(), text: message.text() });
});
page.on("pageerror", (error) => {
  pageErrors.push(error.message);
});

let loadError = null;
try {
  await page.goto(target, { waitUntil: "networkidle", timeout: 30000 });
  await page.waitForTimeout(args.wait);
} catch (error) {
  loadError = error.message;
}

const metrics = await page.evaluate(() => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const documentElement = document.documentElement;
  const body = document.body;
  const allElements = Array.from(document.querySelectorAll("body *"));
  const visibleElements = allElements
    .map((element, index) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        index,
        tag: element.tagName.toLowerCase(),
        id: element.id || "",
        classes: typeof element.className === "string" ? element.className : "",
        role: element.getAttribute("role") || "",
        component: element.getAttribute("data-component") || "",
        text: (element.textContent || "").trim().replace(/\s+/g, " ").slice(0, 80),
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        display: style.display,
        visibility: style.visibility,
        opacity: Number(style.opacity),
        overflowX: style.overflowX,
        overflowY: style.overflowY,
        color: style.color,
        backgroundColor: style.backgroundColor,
        fontSize: Number.parseFloat(style.fontSize),
        zIndex: style.zIndex,
      };
    })
    .filter((element) => element.width > 1 && element.height > 1 && element.display !== "none" && element.visibility !== "hidden" && element.opacity > 0.01);

  const panels = visibleElements.filter((element) => {
    const classNames = element.classes.split(/\s+/).filter(Boolean);
    return element.component || classNames.includes("panel");
  });
  const charts = Array.from(document.querySelectorAll("canvas, svg, [id*='chart' i], [class*='chart' i]")).map((element) => {
    const rect = element.getBoundingClientRect();
    let nonBlank = null;
    if (element.tagName.toLowerCase() === "canvas") {
      const canvas = element;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (context && canvas.width > 0 && canvas.height > 0) {
        const stepX = Math.max(1, Math.floor(canvas.width / 16));
        const stepY = Math.max(1, Math.floor(canvas.height / 16));
        let colored = 0;
        for (let y = 0; y < canvas.height; y += stepY) {
          for (let x = 0; x < canvas.width; x += stepX) {
            const pixel = context.getImageData(x, y, 1, 1).data;
            if (pixel[3] > 0 && (pixel[0] + pixel[1] + pixel[2] > 8)) colored += 1;
          }
        }
        nonBlank = colored > 4;
      }
    }
    return {
      tag: element.tagName.toLowerCase(),
      id: element.id || "",
      classes: typeof element.className === "string" ? element.className : "",
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      nonBlank,
    };
  });

  const textNodes = visibleElements.filter((element) => element.text.length > 0);
  const colors = [...new Set(visibleElements.map((element) => element.color).filter(Boolean))];
  const backgrounds = [...new Set(visibleElements.map((element) => element.backgroundColor).filter((value) => value && value !== "rgba(0, 0, 0, 0)"))];

  return {
    title: document.title,
    bodyTextLength: body.innerText.trim().length,
    scrollWidth: documentElement.scrollWidth,
    scrollHeight: documentElement.scrollHeight,
    viewportWidth,
    viewportHeight,
    visibleElements,
    panels,
    charts,
    textNodes,
    colors,
    backgrounds,
  };
});

const issues = [];

if (loadError) {
  issues.push(issue("error", "PAGE_LOAD_FAILED", "Page failed to load.", { loadError }));
}

if (metrics.bodyTextLength < 20) {
  issues.push(issue("error", "BODY_EMPTY", "Body appears blank or nearly blank.", { bodyTextLength: metrics.bodyTextLength }));
}

const severeConsole = consoleMessages.filter((message) => message.type === "error");
if (severeConsole.length > 0) {
  issues.push(issue("error", "CONSOLE_ERRORS", "Console errors were reported.", { count: severeConsole.length, messages: severeConsole.slice(0, 5) }));
}

if (pageErrors.length > 0) {
  issues.push(issue("error", "PAGE_ERRORS", "Runtime page errors were reported.", { pageErrors: pageErrors.slice(0, 5) }));
}

if (metrics.scrollWidth > viewport.width + 2) {
  issues.push(issue("error", "HORIZONTAL_OVERFLOW", "Document is wider than the viewport.", { scrollWidth: metrics.scrollWidth, viewportWidth: viewport.width }));
}

if (metrics.scrollHeight > viewport.height * 1.15) {
  issues.push(issue("warning", "VERTICAL_OVERFLOW", "Document is substantially taller than the viewport.", { scrollHeight: metrics.scrollHeight, viewportHeight: viewport.height }));
}

const outOfViewport = metrics.panels.filter((panel) => panel.left < -2 || panel.top < -2 || panel.right > viewport.width + 2 || panel.bottom > viewport.height + 2);
if (outOfViewport.length > 0) {
  issues.push(issue("error", "PANEL_OUT_OF_VIEWPORT", "One or more panels extend outside the viewport.", { count: outOfViewport.length, examples: outOfViewport.slice(0, 5) }));
}

const overlaps = [];
for (let leftIndex = 0; leftIndex < metrics.panels.length; leftIndex += 1) {
  for (let rightIndex = leftIndex + 1; rightIndex < metrics.panels.length; rightIndex += 1) {
    const left = metrics.panels[leftIndex];
    const right = metrics.panels[rightIndex];
    const area = overlapArea(left, right);
    const minArea = Math.min(left.width * left.height, right.width * right.height);
    if (area > 180 && area / minArea > 0.08) {
      overlaps.push({ left, right, area, ratio: area / minArea });
    }
  }
}
if (overlaps.length > 0) {
  issues.push(issue("error", "PANEL_OVERLAP", "Panels appear to overlap.", { count: overlaps.length, examples: overlaps.slice(0, 3) }));
}

const chartIssues = metrics.charts.filter((chart) => chart.width < 80 || chart.height < 60 || chart.nonBlank === false);
if (metrics.charts.length === 0) {
  issues.push(issue("warning", "NO_CHARTS_FOUND", "No chart-like elements were found.", {}));
} else if (chartIssues.length > 0) {
  issues.push(issue("error", "CHART_RENDER_ISSUE", "Some charts are too small or blank.", { count: chartIssues.length, examples: chartIssues.slice(0, 5) }));
}

const tinyText = metrics.textNodes.filter((element) => element.fontSize > 0 && element.fontSize < 10);
if (tinyText.length > 6) {
  issues.push(issue("warning", "TINY_TEXT", "Many visible text elements are smaller than 10px.", { count: tinyText.length }));
}

const clippedText = metrics.textNodes.filter((element) => element.text.length > 12 && (element.width < 24 || element.height < element.fontSize * 0.8));
if (clippedText.length > 0) {
  issues.push(issue("warning", "POSSIBLE_TEXT_CLIPPING", "Some text elements have suspiciously small boxes.", { count: clippedText.length, examples: clippedText.slice(0, 5) }));
}

if (metrics.colors.length > 28) {
  issues.push(issue("warning", "COLOR_SPRAWL", "Many distinct text colors were detected; check visual consistency.", { count: metrics.colors.length }));
}

const leftEdges = metrics.panels.map((panel) => Math.round(panel.left)).filter((value) => value >= 0 && value <= viewport.width);
const uniqueLeftEdges = [...new Set(leftEdges)];
if (uniqueLeftEdges.length > 12) {
  issues.push(issue("warning", "GRID_ALIGNMENT_VARIANCE", "Many unique panel left edges were detected; check grid alignment.", { uniqueLeftEdges: uniqueLeftEdges.slice(0, 20) }));
}

await page.screenshot({ path: args.screenshot, fullPage: true });
await browser.close();

const errors = issues.filter((item) => item.severity === "error");
const warnings = issues.filter((item) => item.severity === "warning");
const report = {
  ok: errors.length === 0,
  target,
  viewport,
  screenshot: path.resolve(args.screenshot),
  summary: {
    errors: errors.length,
    warnings: warnings.length,
    visibleElements: metrics.visibleElements.length,
    panels: metrics.panels.length,
    charts: metrics.charts.length,
    consoleMessages: consoleMessages.length,
  },
  issues,
  metrics: {
    title: metrics.title,
    bodyTextLength: metrics.bodyTextLength,
    scrollWidth: metrics.scrollWidth,
    scrollHeight: metrics.scrollHeight,
    chartCount: metrics.charts.length,
    panelCount: metrics.panels.length,
    textColorCount: metrics.colors.length,
    backgroundColorCount: metrics.backgrounds.length,
  },
};

await fs.writeFile(args.out, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report.summary, null, 2));

process.exit(report.ok ? 0 : 1);
