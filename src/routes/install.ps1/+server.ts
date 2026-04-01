import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const BOOTSTRAP_PS1_URL =
  "https://raw.githubusercontent.com/fidan-lang/fidan/refs/heads/main/scripts/bootstrap.ps1";

export const GET: RequestHandler = async () => {
  throw redirect(307, BOOTSTRAP_PS1_URL);
};
