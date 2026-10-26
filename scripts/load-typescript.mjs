import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
const require = createRequire(import.meta.url);
// Exercise the actual renderer/metadata in Node checks without a second implementation.
export function loadTypeScript(filename, overrides = {}) {
  const module = { exports: {} };
  const code = ts.transpileModule(readFileSync(filename, "utf8"), {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
    },
  }).outputText;
  new Function("require", "module", "exports", code)(
    (name) => (name in overrides ? overrides[name] : require(name)),
    module,
    module.exports,
  );
  return module.exports;
}
