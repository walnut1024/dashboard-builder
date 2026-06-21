#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const METHODS = new Set(["get", "put", "post", "delete", "options", "head", "patch", "trace"]);

function usage() {
  return `Usage:
  node scripts/validate-dashboard-api.mjs DASHBOARD_API.yaml

Checks a dashboard OpenAPI contract for the basic structure needed before hybrid or production implementation.`;
}

function issue(severity, code, message, evidence = {}) {
  return { severity, code, message, evidence };
}

function parseArgs(argv) {
  const args = { file: null, help: false };
  for (let index = 2; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") args.help = true;
    else if (!args.file) args.file = arg;
  }
  return args;
}

function readJsonContract(text) {
  const parsed = JSON.parse(text);
  const issues = [];
  const openapi = parsed.openapi;

  if (!openapi) issues.push(issue("error", "MISSING_OPENAPI", "Missing top-level openapi version."));
  else if (!/^3\.(0|1)(\.|$)/.test(String(openapi))) issues.push(issue("error", "UNSUPPORTED_OPENAPI", "OpenAPI version should be 3.0.x or 3.1.x.", { openapi }));

  if (!parsed.info || typeof parsed.info !== "object") {
    issues.push(issue("error", "MISSING_INFO", "Missing top-level info object."));
  } else {
    if (!parsed.info.title) issues.push(issue("error", "MISSING_INFO_TITLE", "Missing info.title."));
    if (!parsed.info.version) issues.push(issue("error", "MISSING_INFO_VERSION", "Missing info.version."));
  }

  if (!parsed.paths || typeof parsed.paths !== "object") {
    issues.push(issue("error", "MISSING_PATHS", "Missing top-level paths object."));
  } else {
    checkJsonPaths(parsed.paths, issues);
  }

  if (!parsed.components || typeof parsed.components !== "object") {
    issues.push(issue("error", "MISSING_COMPONENTS", "Missing top-level components object."));
  } else if (!parsed.components.schemas || typeof parsed.components.schemas !== "object") {
    issues.push(issue("error", "MISSING_SCHEMAS", "Missing components.schemas object."));
  } else if (Object.keys(parsed.components.schemas).length === 0) {
    issues.push(issue("warning", "EMPTY_SCHEMAS", "components.schemas is empty. Confirm this is intentional for the first pass."));
  }

  checkServers(parsed.servers, issues);
  return issues;
}

function checkJsonPaths(paths, issues) {
  const pathNames = Object.keys(paths);
  if (pathNames.length === 0) {
    issues.push(issue("warning", "EMPTY_PATHS", "paths is empty. Hybrid can start this way only if the user accepts the missing endpoint detail."));
    return;
  }

  for (const pathName of pathNames) {
    if (!pathName.startsWith("/")) issues.push(issue("warning", "PATH_SHOULD_START_WITH_SLASH", "Path should start with /.", { path: pathName }));
    const pathItem = paths[pathName] || {};
    const methods = Object.keys(pathItem).filter((key) => METHODS.has(key.toLowerCase()));
    if (methods.length === 0) {
      issues.push(issue("error", "PATH_WITHOUT_METHOD", "Path has no HTTP method.", { path: pathName }));
      continue;
    }
    for (const method of methods) {
      const operation = pathItem[method] || {};
      if (!operation.responses || typeof operation.responses !== "object") {
        issues.push(issue("error", "METHOD_WITHOUT_RESPONSES", "Operation is missing responses.", { path: pathName, method }));
      } else if (!Object.keys(operation.responses).some((code) => code.startsWith("2") || code === "default")) {
        issues.push(issue("warning", "METHOD_WITHOUT_SUCCESS_RESPONSE", "Operation has no 2xx or default response.", { path: pathName, method }));
      }
    }
  }
}

function checkServers(servers, issues) {
  if (!Array.isArray(servers) || servers.length === 0) {
    issues.push(issue("warning", "MISSING_SERVERS", "servers is missing or empty. Confirm the runtime base URL or proxy path before production."));
    return;
  }
  for (const server of servers) {
    const url = typeof server === "string" ? server : server?.url;
    if (!url) {
      issues.push(issue("warning", "SERVER_WITHOUT_URL", "A server entry is missing url."));
    } else if (/example\.com|localhost|127\.0\.0\.1/.test(url)) {
      issues.push(issue("warning", "PLACEHOLDER_SERVER", "Server URL looks like a placeholder. Confirm before production.", { url }));
    }
  }
}

function yamlTopValue(lines, key) {
  const pattern = new RegExp(`^${key}:\\s*(.*)$`);
  for (const line of lines) {
    const match = pattern.exec(line);
    if (match) return match[1].trim();
  }
  return null;
}

function yamlSection(lines, key) {
  const start = lines.findIndex((line) => line === `${key}:` || line.startsWith(`${key}: `));
  if (start === -1) return null;
  const block = [];
  for (let index = start + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (/^[A-Za-z][A-Za-z0-9_.-]*:\s*/.test(line)) break;
    block.push(line);
  }
  return block;
}

function yamlChildValue(section, key) {
  if (!section) return null;
  const pattern = new RegExp(`^\\s{2}${key}:\\s*(.*)$`);
  for (const line of section) {
    const match = pattern.exec(line);
    if (match) return match[1].trim();
  }
  return null;
}

function yamlPathLine(line) {
  const match = /^\s{2}(?:"([^"]+)"|'([^']+)'|(\/[^:]+)):\s*(.*)$/.exec(line);
  if (!match) return null;
  return {
    path: match[1] || match[2] || match[3],
    rest: match[4] || "",
  };
}

function yamlMethodLine(line) {
  const match = /^\s{4}([a-z]+):\s*(.*)$/.exec(line);
  if (!match || !METHODS.has(match[1])) return null;
  return {
    method: match[1],
    rest: match[2] || "",
  };
}

function hasInlineSuccessResponse(text) {
  return /(?:^|[\s{,])["']?(2\d\d|default)["']?\s*:/.test(text);
}

function yamlOperationHasSuccessResponse(methodRest, methodBlock) {
  if (hasInlineSuccessResponse(methodRest)) return true;

  const responseLine = methodBlock.find((line) => /^\s{6}responses:\s*/.test(line));
  if (!responseLine) return false;

  const responseRest = responseLine.replace(/^\s{6}responses:\s*/, "");
  if (hasInlineSuccessResponse(responseRest)) return true;

  return methodBlock.some((line) => /^\s{8}["']?(2\d\d|default)["']?:\s*/.test(line));
}

function readYamlContract(text) {
  const lines = text
    .replace(/\t/g, "  ")
    .split(/\r?\n/)
    .map((line) => line.replace(/\s+$/, ""))
    .filter((line) => line.trim() && !line.trimStart().startsWith("#"));

  const issues = [];
  const openapi = yamlTopValue(lines, "openapi");
  if (!openapi) issues.push(issue("error", "MISSING_OPENAPI", "Missing top-level openapi version."));
  else if (!/^["']?3\.(0|1)(\.|["']|$)/.test(openapi)) issues.push(issue("error", "UNSUPPORTED_OPENAPI", "OpenAPI version should be 3.0.x or 3.1.x.", { openapi }));

  const info = yamlSection(lines, "info");
  if (!info) {
    issues.push(issue("error", "MISSING_INFO", "Missing top-level info section."));
  } else {
    if (!yamlChildValue(info, "title")) issues.push(issue("error", "MISSING_INFO_TITLE", "Missing info.title."));
    if (!yamlChildValue(info, "version")) issues.push(issue("error", "MISSING_INFO_VERSION", "Missing info.version."));
  }

  const paths = yamlSection(lines, "paths");
  if (!paths) {
    issues.push(issue("error", "MISSING_PATHS", "Missing top-level paths section."));
  } else {
    checkYamlPaths(paths, issues);
  }

  const components = yamlSection(lines, "components");
  if (!components) {
    issues.push(issue("error", "MISSING_COMPONENTS", "Missing top-level components section."));
  } else if (!components.some((line) => /^\s{2}schemas:\s*/.test(line))) {
    issues.push(issue("error", "MISSING_SCHEMAS", "Missing components.schemas section."));
  } else if (!components.some((line) => /^\s{4}[A-Za-z0-9_.-]+:\s*/.test(line))) {
    issues.push(issue("warning", "EMPTY_SCHEMAS", "components.schemas appears empty. Confirm this is intentional for the first pass."));
  }

  checkYamlServers(lines, issues);
  return issues;
}

function checkYamlPaths(paths, issues) {
  if (paths.length === 0 || paths.every((line) => !line.trim() || line.trim() === "{}")) {
    issues.push(issue("warning", "EMPTY_PATHS", "paths is empty. Hybrid can start this way only if the user accepts the missing endpoint detail."));
    return;
  }

  const pathIndexes = [];
  for (let index = 0; index < paths.length; index += 1) {
    const pathLine = yamlPathLine(paths[index]);
    if (pathLine) pathIndexes.push({ index, path: pathLine.path, rest: pathLine.rest });
  }

  if (pathIndexes.length === 0) {
    issues.push(issue("error", "NO_PATH_ITEMS", "paths has no '/path:' entries."));
    return;
  }

  for (let i = 0; i < pathIndexes.length; i += 1) {
    const current = pathIndexes[i];
    const next = pathIndexes[i + 1]?.index ?? paths.length;
    const block = paths.slice(current.index + 1, next);
    const methodIndexes = [];
    for (let index = 0; index < block.length; index += 1) {
      const methodLine = yamlMethodLine(block[index]);
      if (methodLine) methodIndexes.push({ index, method: methodLine.method, rest: methodLine.rest });
    }

    if (methodIndexes.length === 0) {
      issues.push(issue("error", "PATH_WITHOUT_METHOD", "Path has no HTTP method.", { path: current.path }));
      continue;
    }

    for (let j = 0; j < methodIndexes.length; j += 1) {
      const method = methodIndexes[j];
      const methodEnd = methodIndexes[j + 1]?.index ?? block.length;
      const methodBlock = block.slice(method.index + 1, methodEnd);
      const hasResponses = /(?:^|[\s{,])responses\s*:/.test(method.rest) || methodBlock.some((line) => /^\s{6}responses:\s*/.test(line));
      if (!hasResponses) {
        issues.push(issue("error", "METHOD_WITHOUT_RESPONSES", "Operation is missing responses.", { path: current.path, method: method.method }));
      } else if (!yamlOperationHasSuccessResponse(method.rest, methodBlock)) {
        issues.push(issue("warning", "METHOD_WITHOUT_SUCCESS_RESPONSE", "Operation has no 2xx or default response.", { path: current.path, method: method.method }));
      }
    }
  }
}

function checkYamlServers(lines, issues) {
  const servers = yamlSection(lines, "servers");
  if (!servers) {
    issues.push(issue("warning", "MISSING_SERVERS", "servers is missing. Confirm the runtime base URL or proxy path before production."));
    return;
  }

  const urls = servers
    .map((line) => /^\s*-\s+url:\s*(.+)$/.exec(line) || /^\s{4}url:\s*(.+)$/.exec(line))
    .filter(Boolean)
    .map((match) => match[1].replace(/^["']|["']$/g, ""));

  if (urls.length === 0) {
    issues.push(issue("warning", "SERVER_WITHOUT_URL", "servers has no url entries."));
  }
  for (const url of urls) {
    if (/example\.com|localhost|127\.0\.0\.1/.test(url)) {
      issues.push(issue("warning", "PLACEHOLDER_SERVER", "Server URL looks like a placeholder. Confirm before production.", { url }));
    }
  }
}

const args = parseArgs(process.argv);
if (args.help || !args.file) {
  console.log(usage());
  process.exit(args.help ? 0 : 2);
}

const filePath = path.resolve(args.file);
let text;
try {
  text = fs.readFileSync(filePath, "utf8");
} catch (error) {
  console.error(`Failed to read ${filePath}: ${error.message}`);
  process.exit(2);
}

let issues;
try {
  const trimmed = text.trim();
  issues = trimmed.startsWith("{") ? readJsonContract(trimmed) : readYamlContract(trimmed);
} catch (error) {
  console.error(`Failed to parse ${filePath}: ${error.message}`);
  process.exit(2);
}

const errors = issues.filter((item) => item.severity === "error");
const warnings = issues.filter((item) => item.severity === "warning");
const result = {
  file: filePath,
  errors: errors.length,
  warnings: warnings.length,
  issues,
};

console.log(JSON.stringify(result, null, 2));
process.exit(errors.length > 0 ? 1 : 0);
