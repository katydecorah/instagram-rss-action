const { formatFeed, generateFeed } = require("../src/utils");
const feed = require("./fixtures/feed.json");
const hashtags = require("./fixtures/hashtags.json");

const metadata = {
  title: "Insta brunch",
  home_page_url: "https://katydecorah.com/insta-brunch/",
  feed_url: "https://katydecorah.com/insta-brunch/feed.json",
  favicon: "https://katydecorah.com/insta-brunch/favicon.ico",
};

it("formatFeed", () => {
  expect(formatFeed(feed, "katydecorah")).toMatchSnapshot();
  expect(formatFeed(hashtags, "eddiefs_eatery")).toMatchSnapshot();
});

it("generateFeed", () => {
  const posts = formatFeed(feed, "katydecorah");
  expect(generateFeed(posts, metadata)).toMatchSnapshot();
});
