const { Feed } = require("feed");

function generateFeed(posts) {
  const feed = new Feed({
    title: "Instagram feed",
    description: "Public Instagram accounts I want to watch",
    id: "https://katydecorah.com/",
    link: "https://katydecorah.com/",
    language: "en",
    favicon: "https://katydecorah.com/favicon.ico",
  });

  posts.forEach((post) => {
    feed.addItem(post);
  });

  return feed.json1();
}

function titlize(arr) {
  const firstItem = arr[0];
  return firstItem ? firstItem.split(/(\.|\n|!)/)[0] : "";
}

function getCaption(obj) {
  return obj.edges.map((item) => item.node).map((item) => item.text);
}

function formatContent(arr) {
  if (arr.length > 0) {
    return arr.map((line) => `<p>${line}</p>`).join("\n");
  }
  return;
}

function formatFeed(feed, handle) {
  return feed.user.edge_owner_to_timeline_media.edges
    .map((item) => item.node)
    .map((p) => {
      const caption = getCaption(p.edge_media_to_caption);
      return {
        title: titlize(caption),
        id: p.id,
        link: `https://instagram.com/p/${p.shortcode}`,
        content: `${formatContent(caption)}<p><img src="${
          p.display_url
        }" alt="" /></p>`,
        author: [
          {
            name: handle,
          },
        ],
        date: new Date(p.taken_at_timestamp * 1000),
        image: p.display_url,
      };
    });
}

module.exports = {
  formatFeed,
  generateFeed,
};
