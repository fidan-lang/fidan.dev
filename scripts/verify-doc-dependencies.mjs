import { appendFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
const [file, setup, args, dal] = process.argv.slice(2);
if (!file || !setup)
  throw new Error(
    "Pass the candidate contract and verified Setup Action checkout",
  );
const { isCommit, verifyCheckout, readCandidate } = await import(
  pathToFileURL(path.resolve(setup, "scripts/verify-candidate.mjs"))
);
const contract = readCandidate(file);
verifyCheckout(setup, contract.setup_sha);
for (const [name, repository, directory] of [
  ["args", "fidan-lang/args", args],
  ["dal", "fidan-lang/dal", dal],
]) {
  if (
    contract[`${name}_repository`] !== repository ||
    !isCommit(contract[`${name}_sha`])
  )
    throw new Error(
      `Docs require the official ${name} repository and exact immutable source SHA`,
    );
  if (directory) verifyCheckout(directory, contract[`${name}_sha`]);
}
for (const name of ["args", "dal"]) {
  const repository = contract[`${name}_repository`];
  if (process.env.GITHUB_OUTPUT)
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `${name}_repository=${repository}\n${name}_sha=${contract[`${name}_sha`]}\n`,
    );
}
console.log("Verified documentation package/registry source contracts");
