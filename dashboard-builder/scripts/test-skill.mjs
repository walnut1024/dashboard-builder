#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const skillRoot = path.resolve(new URL("..", import.meta.url).pathname);
const failures = [];
const checks = [];

function read(relativePath) {
  return fs.readFileSync(path.join(skillRoot, relativePath), "utf8");
}

function exists(relativePath) {
  return fs.existsSync(path.join(skillRoot, relativePath));
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function check(name, fn) {
  try {
    fn();
    checks.push({ name, status: "pass" });
  } catch (error) {
    checks.push({ name, status: "fail", message: error.message });
    failures.push({ name, message: error.message });
  }
}

function runNodeScript(scriptRelativePath, fixtureText) {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "dashboard-builder-"));
  const fixturePath = path.join(tempDir, "DASHBOARD_API.yaml");
  fs.writeFileSync(fixturePath, fixtureText, "utf8");

  const result = spawnSync(process.execPath, [path.join(skillRoot, scriptRelativePath), fixturePath], {
    encoding: "utf8",
  });

  fs.rmSync(tempDir, { recursive: true, force: true });
  return result;
}

function assertValidatorPasses(name, fixtureText) {
  const result = runNodeScript("scripts/validate-dashboard-api.mjs", fixtureText);
  assert(result.status === 0, `${name} failed with exit ${result.status}: ${result.stdout || result.stderr}`);
  const parsed = JSON.parse(result.stdout);
  assert(parsed.errors === 0, `${name} reported errors: ${result.stdout}`);
  assert(
    !parsed.issues.some((item) => item.code === "METHOD_WITHOUT_SUCCESS_RESPONSE"),
    `${name} reported a false success-response warning: ${result.stdout}`,
  );
}

check("required files exist", () => {
  [
    "SKILL.md",
    "references/workflow.md",
    "references/dashboard-spec.md",
    "references/api-contract.md",
    "references/chart-contract.md",
    "references/verification.md",
    "assets/template.html",
    "assets/react-echarts-template/package.json",
    "assets/templates/dashboard-design-contract.md",
    "scripts/inspect-dashboard.mjs",
    "scripts/validate-dashboard-api.mjs",
  ].forEach((relativePath) => assert(exists(relativePath), `Missing ${relativePath}`));
});

check("evals json parses", () => {
  const evals = JSON.parse(read("evals/evals.json"));
  assert(Array.isArray(evals.evals), "evals/evals.json must contain an evals array.");
  assert(evals.evals.length > 0, "evals/evals.json must contain at least one eval.");
});

check("workflow template choices are mode-aware", () => {
  const workflow = read("references/workflow.md");
  assert(workflow.includes("assets/template.html"), "Workflow must mention the standalone prototype template.");
  assert(workflow.includes("assets/react-echarts-template/"), "Workflow must mention the React hybrid/production template.");
  assert(workflow.includes("assets/templates/*"), "Workflow must mention reusable design and QA templates.");
});

check("advanced visual contract is optional", () => {
  const spec = read("references/dashboard-spec.md");
  assert(spec.includes("## Optional: Advanced Visual Contract"), "DASHBOARD.md structure must mark Advanced Visual Contract optional.");
  assert(spec.includes("Include this section only when advanced visual techniques are part of the design."), "Optional advanced visual section needs an explicit inclusion rule.");
});

check("react template includes tailwind pipeline", () => {
  const pkg = JSON.parse(read("assets/react-echarts-template/package.json"));
  assert(pkg.devDependencies?.tailwindcss || pkg.dependencies?.tailwindcss, "React template package.json must include tailwindcss.");
  assert(pkg.devDependencies?.postcss || pkg.dependencies?.postcss, "React template package.json must include postcss.");
  assert(pkg.devDependencies?.autoprefixer || pkg.dependencies?.autoprefixer, "React template package.json must include autoprefixer.");
  assert(exists("assets/react-echarts-template/tailwind.config.js"), "React template must include tailwind.config.js.");
  assert(exists("assets/react-echarts-template/postcss.config.js"), "React template must include postcss.config.js.");
  assert(read("assets/react-echarts-template/src/styles.css").includes("@tailwind"), "React template CSS must enter the Tailwind pipeline.");
});

check("quality cannot be downgraded to pass inspection", () => {
  const skill = read("SKILL.md");
  const implementation = read("references/implementation.md");
  const verification = read("references/verification.md");

  assert(skill.includes("Quality and confirmed requirements outrank automated inspection"), "SKILL.md must state that quality outranks automated inspection.");
  assert(
    implementation.includes("Do not replace a confirmed real map with a DOM/SVG schematic"),
    "implementation.md must forbid replacing real maps with lower-fidelity schematics to pass checks.",
  );
  assert(
    implementation.includes("echarts.registerMap"),
    "implementation.md must direct ECharts map implementations to register local GeoJSON.",
  );
  assert(
    verification.includes("A passing inspection is not acceptable if it was achieved by lowering a confirmed requirement."),
    "verification.md must reject passing checks by lowering confirmed requirements.",
  );
  assert(
    verification.includes("asset loading, data registration, container size, timing, projection, renderer, CORS, and console errors"),
    "verification.md must list root causes to diagnose before downgrading visuals.",
  );
});

check("stale or vendor-bound wording is absent", () => {
  const files = [
    "SKILL.md",
    "references/workflow.md",
    "references/dashboard-spec.md",
    "references/implementation.md",
    "references/verification.md",
  ];
  const forbidden = [
    /\bstrict mode\b/i,
    /for each step/i,
    /seven steps/i,
    /mobile-first/i,
    /sibling state/i,
    /forbid WebGL/i,
    /ban WebGL/i,
    /do not use WebGL/i,
    /\bmodel,\s*provider\b/i,
    /\bprovider,\s*model\b/i,
  ];

  for (const file of files) {
    const text = read(file);
    for (const pattern of forbidden) {
      assert(!pattern.test(text), `${file} contains forbidden stale wording: ${pattern}`);
    }
  }
});

check("validator accepts quoted YAML path keys", () => {
  assertValidatorPasses(
    "quoted path fixture",
    `openapi: 3.1.0
info:
  title: Dashboard API
  version: 1.0.0
servers:
  - url: https://api.internal.example
paths:
  '/ops/{id}':
    get:
      responses:
        '200':
          description: OK
components:
  schemas:
    Snapshot:
      type: object
`,
  );
});

check("validator accepts inline YAML responses", () => {
  assertValidatorPasses(
    "inline response fixture",
    `openapi: 3.1.0
info:
  title: Dashboard API
  version: 1.0.0
servers:
  - url: https://api.internal.example
paths:
  /ops:
    get:
      responses: { '200': { description: OK } }
components:
  schemas:
    Snapshot:
      type: object
`,
  );
});

if (failures.length > 0) {
  console.error(JSON.stringify({ status: "fail", failures, checks }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ status: "pass", checks }, null, 2));
