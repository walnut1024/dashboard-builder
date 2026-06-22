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

check("interactive intake gates are present", () => {
  const skill = read("SKILL.md");
  const workflow = read("references/workflow.md");
  const evals = read("evals/evals.json");

  assert(skill.includes("Default interaction style is interactive intake"), "SKILL.md must set interactive intake as the default style.");
  assert(skill.includes("Do not complete multiple phases in one response"), "SKILL.md must forbid completing multiple phases by default.");
  assert(skill.includes('Treat a plain "continue" as permission to advance to the next phase only'), "SKILL.md must not treat continue as fast/default authorization.");
  assert(workflow.includes("## Interactive Intake Contract"), "workflow.md must include an Interactive Intake Contract.");
  assert(workflow.includes("Advance one phase per assistant response."), "workflow.md must require one phase per response.");
  assert(workflow.includes("Ask at most three high-value questions"), "workflow.md must limit question count per response.");
  assert(workflow.includes("Phase transition rules:"), "workflow.md must define phase transition rules.");
  assert(!workflow.includes('"use defaults", "continue", "fast"'), "workflow.md must not include continue in the fast/default authorization list.");
  assert(workflow.includes('Treat a plain "continue" as permission to advance to the next phase only'), "workflow.md must define continue as next-phase-only.");
  assert(workflow.includes("Stage:") && workflow.includes("Missing:") && workflow.includes("Recommended Defaults:"), "workflow format must include intake state fields.");
  assert(evals.includes("First response only handles Phase 1: Brief"), "evals must check sparse prompts do not complete every phase.");
  assert(evals.includes("Asks no more than three high-value Phase 1 questions"), "evals must check sparse prompt question count.");
});

check("viewport adaptation defaults are present", () => {
  const skill = read("SKILL.md");
  const workflow = read("references/workflow.md");
  const spec = read("references/dashboard-spec.md");
  const implementation = read("references/implementation.md");
  const verification = read("references/verification.md");
  const template = read("assets/template.html");
  const evals = read("evals/evals.json");

  assert(skill.includes("default to `fit-contain-center`"), "SKILL.md must default unknown displays to fit-contain-center.");
  assert(workflow.includes("Viewport adaptation modes:"), "workflow.md must define viewport adaptation modes.");
  assert(workflow.includes("Display size or browser viewport"), "workflow.md must ask for display size or browser viewport.");
  assert(spec.includes("## Viewport Adaptation"), "DASHBOARD.md spec must include viewport adaptation.");
  assert(implementation.includes("Scale with `min(viewportWidth / designWidth, viewportHeight / designHeight)`"), "implementation.md must define proportional fit-contain scaling.");
  assert(verification.includes("1440x900") && verification.includes("3840x2160"), "verification.md must require multi-viewport checks.");
  assert(template.includes('data-adaptation-mode="fit-contain-center"'), "template must declare fit-contain-center mode.");
  assert(template.includes("function fitDashboard()"), "template must include a fitDashboard scaler.");
  assert(template.includes("--dashboard-scale"), "template must apply dashboard scale through CSS.");
  assert(evals.includes("viewport adaptation"), "evals must cover viewport adaptation behavior.");
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
