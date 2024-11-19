import { redirect, ActionFunction } from "@remix-run/node";
import { getSession, destroySession } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/sign-in", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
};