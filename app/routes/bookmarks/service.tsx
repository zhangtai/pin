import type { Service } from "~/bookmarks";

export default function BookmarkService(service: Service) {
  const bookmarksOrdered = service.items.sort((first, second) => {
    if (first?.default) {
      return -1;
    }
    if (second?.default) {
      return 1;
    }
    return 0;
  });
  const [defaultBookmark, ...otherBookmarks] = bookmarksOrdered;
  return (
    <div
      className={
        service.className +
        " shadow-lg rounded-2xl p-4 bg-white dark:bg-gray-700 w-72 h-32 mr-4 mb-6"
      }
    >
      <div className="flex items-center justify-between mb-6 relative">
        <div className="flex items-center">
          {service.icon && (
            <img
              src={"/static/image/bookmark-icon/" + service.icon}
              className="max-w-12 max-h-12"
              alt={service.name}
            />
          )}
          <div className="flex flex-col">
            <a
              href={defaultBookmark.url}
              className="after:absolute after:inset-0"
            >
              <span className="font-bold text-sm text-black dark:text-white ml-2">
                {defaultBookmark.name}
              </span>
            </a>
            <span className="text-sm text-gray-500 dark:text-white ml-2">
              {service.name}
            </span>
          </div>
        </div>
        <div className="flex items-center">
          {otherBookmarks.length > 0 && (
            <div className="dropdown dropdown-hover">
              <div tabIndex={0}>
                <button className="text-gray-200">
                  <svg
                    width="25"
                    height="25"
                    fill="currentColor"
                    viewBox="0 0 1792 1792"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M1088 1248v192q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h192q40 0 68 28t28 68zm0-512v192q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h192q40 0 68 28t28 68zm0-512v192q0 40-28 68t-68 28h-192q-40 0-68-28t-28-68v-192q0-40 28-68t68-28h192q40 0 68 28t28 68z"></path>
                  </svg>
                </button>
              </div>
              <ul
                tabIndex={0}
                className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-96"
              >
                {otherBookmarks.map((bookmark, index) => (
                  <li key={index}>
                    <a href={bookmark.url}>{bookmark.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
