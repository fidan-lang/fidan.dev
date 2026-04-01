import { redirect } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";

const BOOTSTRAP_SH_URL =
  "https://raw.githubusercontent.com/fidan-lang/fidan/refs/heads/main/scripts/bootstrap.sh";

export const GET: RequestHandler = async () => {
  throw redirect(307, BOOTSTRAP_SH_URL);
};
