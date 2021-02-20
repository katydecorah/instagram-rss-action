function generateFeed(posts) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: "Instagram feed",
    home_page_url: "https://katydecorah.com/",
    feed_url: "https://katydecorah.com/instagram-rss/feed.json",
    favicon: "https://katydecorah.com/favicon.ico",
    items: posts,
  };
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
  return "";
}

function formatFeed(feed, handle) {
  return feed.user.edge_owner_to_timeline_media.edges
    .map((item) => item.node)
    .map((p) => {
      const caption = getCaption(p.edge_media_to_caption);
      return {
        id: p.id,
        url: `https://instagram.com/p/${p.shortcode}`,
        title: titlize(caption),
        content_html: `${formatContent(caption)}<p><img src="${
          p.display_url
        }" alt="" /></p>`,
        authors: [
          {
            name: handle,
          },
        ],
        date_published: new Date(p.taken_at_timestamp * 1000).toISOString(),
        image: p.display_url,
      };
    });
}

module.exports = {
  formatFeed,
  generateFeed,
};
