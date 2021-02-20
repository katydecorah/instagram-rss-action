const { formatFeed, generateFeed } = require("../src/utils");
const feed = require("./fixtures/feed.json");
const hashtags = require("./fixtures/hashtags.json");

const metadata = {
  title: "Insta brunch",
};

it("formatFeed", () => {
  expect(formatFeed(feed, "katydecorah")).toMatchSnapshot();
  expect(formatFeed(hashtags, "eddiefs_eatery")).toMatchSnapshot();
});

it("generateFeed", () => {
  const posts = formatFeed(feed, "katydecorah");
  expect(generateFeed(posts, metadata)).toMatchSnapshot();
});
