"""Parse documented configuration and syntax-check shell recipes without executing them.

Python 3.11+, PyYAML 6.0.3 and Bash required. Runtime/remote behavior is covered
separately; a valid shell recipe is not evidence that publication was performed.
"""
import json
import os
from pathlib import Path
import re
import shutil
import subprocess
import tomllib

import yaml


def main():
    bash = os.environ.get("BASH_BIN") or shutil.which("bash")
    if not bash:
        raise SystemExit("Bash is required for documentation recipe syntax checks")
    counts = {}
    for file in sorted(Path("src/content/docs").rglob("*.md")):
        for fence in re.finditer(r"^```([^\n]*)\n([\s\S]*?)^```\s*$", file.read_text(encoding="utf-8"), re.M):
            language = fence[1].split()[0] if fence[1].split() else "text"
            source = fence[2]
            try:
                if language == "toml":
                    tomllib.loads(source)
                elif language == "yaml":
                    yaml.safe_load(source)
                elif language in ("bash", "sh"):
                    result = subprocess.run([bash, "-n"], input=source, text=True, capture_output=True, timeout=10)
                    if result.returncode:
                        raise ValueError(result.stderr.strip())
                else:
                    continue
            except (ValueError, yaml.YAMLError, subprocess.SubprocessError) as error:
                raise SystemExit(f"{file}:{file.read_text(encoding='utf-8')[:fence.start()].count(chr(10)) + 1}: {error}") from error
            counts[language] = counts.get(language, 0) + 1
    if not counts:
        raise SystemExit("No documentation configuration/recipes found")
    print(json.dumps(counts, sort_keys=True))


if __name__ == "__main__":
    main()
