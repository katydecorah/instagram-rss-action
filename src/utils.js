const core = require("@actions/core");
const { removeEmoji, removeHashTags } = require("./remover");

function generateFeed(posts, metadata) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    ...metadata,
    items: posts,
  };
}

function truncate(str) {
  const split = str.split(/(\.|\n|!)/)[0];
  let trimmed = split.substring(0, 50);
  if (split.length > trimmed.length) trimmed += "…";
  return trimmed.trim();
}

function titlize(arr) {
  const firstItem = arr[0];
  return firstItem ? truncate(firstItem) : "";
}

function getCaption(obj) {
  return formatCaption(
    obj.edges.map((item) => item.node).map((item) => item.text)
  );
}

function formatCaption(arr) {
  if (arr && arr.length > 0) {
    return arr.reduce((lines, line) => {
      let formatted = removeEmoji(line);
      if (formatted) formatted = removeHashTags(formatted);
      if (formatted) formatted = formatted.trim();
      if (formatted) lines = [...lines, formatted];
      return lines;
    }, []);
  }
  return [];
}

function formatContent(arr) {
  if (arr.length > 0) {
    return arr.map((line) => `<p>${line}</p>`).join("");
  }
  return "";
}

function video({ video_url, display_url }) {
  return `<video src="${video_url}" poster="${display_url}" type="video/mp4">Sorry, your browser doesn't support embedded videos.</video>
`;
}

function image({ display_url }) {
  return `<img src="${display_url}" alt="" />`;
}

function formatFeed(feed, handle) {
  if (!feed.user) {
    core.warning(
      `Failed to fetch Instagram feed for ${handle}. The username is incorrect or the Instagram API has ratelimited this request.`
    );
    return [];
  }
  const posts = feed.user.edge_owner_to_timeline_media.edges.map(
    (item) => item.node
  );
  core.info(`Fetched posts for @${handle}`);
  return posts.map((p) => {
    const caption = getCaption(p.edge_media_to_caption);
    const media = p.is_video ? video(p) : image(p);
    return {
      id: p.id,
      url: `https://instagram.com/p/${p.shortcode}`,
      title: titlize(caption),
      content_html: `<p>@${handle}</p>${formatContent(caption)}<p>${media}</p>`,
      summary: handle,
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
