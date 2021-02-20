const Instagram = require("instagram-web-api");
const { writeFileSync } = require("fs");
const { formatFeed, generateFeed } = require("./utils");

const username = "katydecorah";
const handles = ["nextdoorkitchenandbar", "flatbread.social"];
const feedName = "feed.json";

const metadata = {
  title: "Insta brunch",
  home_page_url: "https://katydecorah.com/insta-brunch/",
  feed_url: "https://katydecorah.com/insta-brunch/feed.json",
  favicon: "https://katydecorah.com/insta-brunch/favicon.ico",
};

const client = new Instagram({ username });

(async function () {
  let allPosts = [];
  for (const handle of handles) {
    const posts = await client.getPhotosByUsername({ username: handle });
    const formatedPosts = formatFeed(posts, handle);
    allPosts = [...allPosts, ...formatedPosts];
  }
  allPosts = allPosts
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .reverse();
  const build = generateFeed(allPosts, metadata);
  writeFileSync(feedName, JSON.stringify(build, null, 2));
})();
