import { redirect } from "remix";

export const loader = async () => {
  return redirect("/bookmarks");
};
