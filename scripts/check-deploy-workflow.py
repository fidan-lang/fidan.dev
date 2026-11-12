"""Check automatic production deployment triggers and safety gates. Requires PyYAML."""
from fnmatch import fnmatchcase
from pathlib import Path

import yaml


def main():
    root = Path(__file__).resolve().parent.parent
    workflow = yaml.load(
        (root / ".github/workflows/deploy-pages.yaml").read_text(encoding="utf-8"),
        Loader=yaml.BaseLoader,
    )
    triggers = workflow["on"]
    assert set(triggers) == {"push", "workflow_dispatch"}
    assert triggers["push"]["branches"] == ["main"]
    assert not triggers["workflow_dispatch"], "Manual redeploy must not require confirmation"
    patterns = triggers["push"]["paths"]
    for filename in (
        "src/routes/+page.svelte", "src/app.css", "src/lib/server/releases.ts",
        "src/content/docs/getting-started.md", "static/images/logo.svg",
        "scripts/install-git-hooks.mjs", "package.json", "package-lock.json",
        "svelte.config.js", "tsconfig.json", "vite.config.mts", "wrangler.toml",
        "LICENSE", "NOTICE", ".github/workflows/_web-checks.yaml",
        ".github/workflows/deploy-pages.yaml",
    ):
        assert any(fnmatchcase(filename, pattern) for pattern in patterns), filename
    for filename in (
        "README.md", "CONTRIBUTING.md", "e2e/smoke.spec.ts", "playwright.config.ts",
        "scripts/check-documentation.test.mjs", "ci/compiler-candidate.json",
    ):
        assert not any(fnmatchcase(filename, pattern) for pattern in patterns), filename

    jobs = workflow["jobs"]
    assert jobs["checks"]["uses"] == "./.github/workflows/_web-checks.yaml"
    deploy = jobs["deploy"]
    assert deploy["needs"] == "checks", "Failed checks must block deployment"
    assert deploy["if"] == "github.ref == 'refs/heads/main'"
    assert deploy["environment"] == "cloudflare-deploy"
    assert deploy["permissions"] == {"contents": "read", "deployments": "write"}
    assert not jobs["checks"].get("secrets"), "Checks must not inherit deploy secrets"
    assert not jobs["checks"].get("continue-on-error")
    assert workflow["permissions"] == {"contents": "read"}
    assert workflow["concurrency"]["group"] == "cloudflare-pages-production"
    assert workflow["concurrency"]["cancel-in-progress"] == "false"
    upload = next(step for step in deploy["steps"] if "apiToken" in step.get("with", {}))
    assert upload["with"]["command"] == (
        "pages deploy .svelte-kit/cloudflare --project-name fidan-dev --branch main"
    )
    print("Automatic deployment triggers, main-only target and web-check gate verified")


if __name__ == "__main__":
    main()
