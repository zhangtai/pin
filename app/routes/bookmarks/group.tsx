import type { Group } from "~/bookmarks";
import BookmarkService from "./service";

export default function ServiceGroup(group: Group) {
  return (
    <div className="flex flex-wrap">
      {group.items.map((service, index) => (
        <div key={index}>
          <BookmarkService
            name={service.name}
            icon={service.icon}
            className={service.className}
            items={service.items}
          />
        </div>
      ))}
    </div>
  );
}
