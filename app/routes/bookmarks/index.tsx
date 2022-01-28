import { useLoaderData } from "remix";
import type { LoaderFunction } from "remix";
import { getBookmarks } from "~/bookmarks";
import type { Group } from "~/bookmarks";
import ServiceGroup from "./group";

export const loader: LoaderFunction = ({ request }) => {
  let url = new URL(request.url);
  let gist = url.searchParams.get("gist");
  return getBookmarks(gist);
};

export default function BookmarksIndexRoute() {
  const groups = useLoaderData<Group[]>();
  return groups.map((group, index) => (
    <div key={index}>
      <h2>{group.name}</h2>
      <ServiceGroup name={group.name} items={group.items} />
    </div>
  ));
}
