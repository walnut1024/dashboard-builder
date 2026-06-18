# Dashboard Builder Skill

`dashboard-builder` is an agent skill for designing, implementing, and verifying visual data dashboards and large-screen data displays.

It guides the agent through:

- usage scenario and delivery mode
- information architecture
- layout selection with ASCII structure diagrams
- visual theme and component patterns
- interaction requirements
- technical constraints
- acceptance criteria
- `DASHBOARD.md` design freeze before implementation
- scripted dashboard quality inspection

## Install

Recommended interactive install:

```bash
npx skills add walnut1024/dashboard-builder --skill dashboard-builder
```

Follow the prompts to choose:

- target agent, such as Claude Code, OpenCode, Codex, or all supported agents
- install scope: global or project
- install mode: symlink by default, or copy files with `--copy`

In agent-managed terminals, the CLI may auto-detect the current agent and run non-interactively. Use the explicit commands below when you want deterministic installs.

Project install for Claude Code:

```bash
npx skills add walnut1024/dashboard-builder --skill dashboard-builder -a claude-code
```

If you choose project scope, this creates `./.claude/skills/dashboard-builder` even when the project does not already have a `.claude` directory.

Install globally for Claude Code:

```bash
npx skills add walnut1024/dashboard-builder --skill dashboard-builder -g -a claude-code -y
```

Install globally for OpenCode:

```bash
npx skills add walnut1024/dashboard-builder --skill dashboard-builder -g -a opencode -y
```

Install globally for Codex:

```bash
npx skills add walnut1024/dashboard-builder --skill dashboard-builder -g -a codex -y
```

Install globally for all supported agents:

```bash
npx skills add walnut1024/dashboard-builder --skill dashboard-builder -g -a '*' -y
```

Note: the `skills` CLI agent name for Codex/Codex CLI is `codex`, not `codex-cli`.

Copy files instead of symlinking:

```bash
npx skills add walnut1024/dashboard-builder --skill dashboard-builder --copy
```

Use directly from GitHub:

```bash
npx skills add https://github.com/walnut1024/dashboard-builder --skill dashboard-builder
```

## Skill

The skill lives in:

```text
dashboard-builder/
├── SKILL.md
├── assets/template.html
├── scripts/inspect-dashboard.mjs
├── references/
└── evals/evals.json
```

## Verification

Validate the skill:

```bash
python /path/to/quick_validate.py dashboard-builder
```

List the skill through the CLI:

```bash
npx skills add ./dashboard-builder --list
```

Inspect the default prototype template:

```bash
node dashboard-builder/scripts/inspect-dashboard.mjs \
  --file dashboard-builder/assets/template.html \
  --viewport 1920x1080 \
  --out /tmp/dashboard-builder-template-inspection.json \
  --screenshot /tmp/dashboard-builder-template-inspection.png
```

`inspect-dashboard.mjs` requires Playwright to be available in the project or via `NODE_PATH`.
