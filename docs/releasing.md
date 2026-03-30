# Releasing Packages

This monorepo uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing all three packages (`@artisanpack-ui/tokens`, `@artisanpack-ui/react`, `@artisanpack-ui/react-laravel`) to npm under the `@artisanpack-ui` scope.

## Overview

The release pipeline has three modes:

| Mode | Trigger | npm tag | Use case |
|------|---------|---------|----------|
| **Stable release** | Merge "Version Packages" PR to `main` | `latest` | Production releases |
| **Snapshot release** | Manual workflow dispatch | Custom (e.g. `snapshot`, `canary`) | Testing pre-release versions |
| **Local dry run** | CLI on your machine | N/A | Verifying before pushing |

All three packages are **linked** in Changesets config, meaning they are always versioned together (a bump to one bumps all).

---

## Prerequisites

- `NPM_TOKEN` secret must be configured in GitHub repo settings (see issue #26)
- The npm organization `@artisanpack-ui` must exist on npmjs.com
- All packages have `publishConfig.access: "public"` and `publishConfig.provenance: true`

---

## Stable Releases

### 1. Add a changeset with your PR

Every PR that changes published code should include a changeset describing what changed. Run:

```bash
npm run changeset
```

This walks you through:
- Which packages are affected
- Whether it's a major, minor, or patch bump
- A summary of the change (this becomes the changelog entry)

It creates a markdown file in `.changeset/` (e.g. `.changeset/brave-dogs-fly.md`). Commit this file with your PR.

**Example changeset file:**

```markdown
---
"@artisanpack-ui/react": minor
---

Added new DateRangePicker component with keyboard navigation support
```

### 2. Changesets bot opens a "Version Packages" PR

When changesets land on `main`, the release job in `ci.yml` uses `changesets/action` to:
- Detect pending changesets
- Open (or update) a PR titled **"chore: version packages"**
- That PR bumps `version` fields in each package.json and updates CHANGELOGs

### 3. Merge the Version Packages PR to publish

Merging the "Version Packages" PR triggers the release job again. This time there are no pending changesets, so the CI pipeline builds all packages first (`npm run build`), then `npx changeset publish` runs which:
- Publishes each changed package to npm with the `latest` tag (using the already-built artifacts)
- Creates GitHub releases with changelog content
- Provenance attestation is included automatically (via `id-token: write` permission)

### Summary of the flow

```text
PR with changeset → merge to main → bot opens "Version Packages" PR → merge that → npm publish
```

---

## Snapshot Releases

Snapshots let you publish a test version without affecting the stable `latest` tag. Useful for:
- Testing unreleased changes in a real project
- Sharing pre-release builds with collaborators
- CI/CD integration testing

### How to trigger

1. Go to **Actions** tab in GitHub
2. Select the **"Snapshot Release"** workflow
3. Click **"Run workflow"**
4. Optionally set a tag name (defaults to `snapshot`, could be `canary`, `next`, `dev`, etc.)

### What happens

The workflow:
1. Installs dependencies and builds all packages
2. Runs the full test suite
3. Runs `changeset version --snapshot <tag>` which creates temporary snapshot versions like `<current-version>-snapshot-<timestamp>` (e.g. `1.2.3-snapshot-20260330120000`)
4. Runs `changeset publish --tag <tag>` which publishes to npm under the specified dist-tag

### Installing a snapshot

```bash
npm install @artisanpack-ui/react@snapshot
# or whatever tag you used:
npm install @artisanpack-ui/react@canary
```

Snapshot versions do **not** affect the `latest` tag, so `npm install @artisanpack-ui/react` still gets the latest stable version.

---

## Local Development Workflow

### Check what would be released

```bash
npx changeset status
```

This shows which packages have pending changesets and what version bumps are queued.

### Preview version bumps locally (dry run)

```bash
npx changeset version
```

This updates package.json versions and CHANGELOGs locally. You can inspect the changes and then `git restore .` to revert if you were just checking.

### Convenience scripts

| Script | Command | What it does |
|--------|---------|-------------|
| `npm run changeset` | `changeset` | Interactive CLI to add a new changeset |
| `npm run version-packages` | `changeset version` | Apply pending changesets (bump versions, update changelogs) |
| `npm run release` | `changeset publish` | Publish all changed packages to npm |

---

## Changelogs

Changelogs are auto-generated per package from changeset descriptions. We use `@changesets/changelog-github` which includes:
- Links to the PR that introduced each change
- Links to the commits
- Author attribution

Changelog files are created/updated at `packages/<name>/CHANGELOG.md` when the "Version Packages" PR is created.

---

## Provenance

All published packages include [npm provenance](https://docs.npmjs.com/generating-provenance-statements) attestation. This means:
- Each published package is cryptographically linked to the GitHub Actions run that built it
- Users can verify the package came from this repo's CI, not a compromised local machine
- The `id-token: write` permission in the release workflow enables this

You can verify provenance on npmjs.com — published packages will show a green "Provenance" badge.

---

## Linked Versioning

All three packages are **linked** in `.changeset/config.json`:

```json
"linked": [["@artisanpack-ui/tokens", "@artisanpack-ui/react", "@artisanpack-ui/react-laravel"]]
```

This means if any package gets a minor bump, all three packages are bumped to the same minor version. This keeps versions in sync across the ecosystem so users don't have to worry about version matrix compatibility.

---

## Troubleshooting

### "Version Packages" PR not appearing

- Make sure there are `.changeset/*.md` files (not just `config.json` and `README.md`) on `main`
- Check the release job logs in GitHub Actions

### Publish fails with auth error

- Verify `NPM_TOKEN` is set in repo secrets (Settings → Secrets and variables → Actions)
- Verify the token has publish access to the `@artisanpack-ui` scope

### Snapshot version looks wrong

- Snapshot versions are derived from the current `version` in each package.json, e.g. `1.2.3-snapshot-20260330120000`
- If packages are still at `0.0.0` (before any stable release), snapshots will look like `0.0.0-snapshot-20260330120000`

### Provenance attestation fails

- Ensure the workflow has `id-token: write` permission
- Provenance only works in GitHub Actions, not from local machines
