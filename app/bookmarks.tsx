import { AxiosResponse } from "axios";
import fs from "fs";
import YAML from "yaml";
import { z } from "zod";

const axios = require("axios").default;

const BookmarkLink = z.object({
  name: z.string(),
  url: z.string().url(),
  default: z.optional(z.boolean()),
});
export type BookmarkLink = z.infer<typeof BookmarkLink>;

const Service = z.object({
  name: z.string(),
  icon: z.optional(z.string()),
  mode: z.optional(z.string()),
  description: z.optional(z.string()),
  support: z.optional(z.string()),
  className: z.optional(z.string()),
  items: z.array(BookmarkLink),
});
export type Service = z.infer<typeof Service>;

const Group = z.object({
  name: z.string(),
  mode: z.optional(z.string()),
  description: z.optional(z.string()),
  items: z.array(Service),
});
export type Group = z.infer<typeof Group>;

const Root = z.object({
  mode: z.optional(z.string()),
  items: z.array(Group),
});
export type Root = z.infer<typeof Root>;

const file = fs.readFileSync("./bookmarks/default.yml", "utf8");
const defaultBookmarks: Root = YAML.parse(file);

interface Gist {
  files: {
    "pin-bookmarks.yml": {
      content: string;
    };
  };
}

async function getGistBookmarks(gist: string): Promise<Root> {
  const response: AxiosResponse<Gist> = await axios.get(
    `https://api.github.com/gists/${gist}`,
    {
      method: "GET",
      headers: {
        Authorization:
          "Basic GITHUB_TOKEN",
      },
    }
  );
  return YAML.parse(response.data.files["pin-bookmarks.yml"].content);
}

interface GenericBookmarkItem {
  name: string;
  description?: string;
  support?: string;
  className?: string;
  mode?: string;
  icon?: string;
  items?: GenericBookmarkItem[];
}

function mergeList<T extends GenericBookmarkItem>(
  base: T[],
  provides: T[]
): T[] {
  let list = [...base];
  console.log(provides);

  for (const provide of provides) {
    let baseItem = list.find((item) => item.name === provide.name);
    if (baseItem) {
      if (
        (provide.mode === undefined || provide.mode === "merge") &&
        provide.items
      ) {
        baseItem.items = mergeList(baseItem.items || [], provide.items);
      } else if (provide?.mode === "remove") {
        list = list.filter((g) => g.name !== provide.name);
      }
    } else {
      list.push(provide);
    }
  }
  return list;
}

export async function getBookmarks(gist: string | null) {
  if (!gist) {
    return defaultBookmarks.items;
  }
  const gistBookmarks = await getGistBookmarks(gist);
  if (gistBookmarks?.mode === "override") {
    return gistBookmarks.items;
  } else if (
    gistBookmarks.mode === undefined ||
    gistBookmarks.mode === "merge"
  ) {
    return mergeList(defaultBookmarks.items, gistBookmarks.items);
  }
  return {};
}
