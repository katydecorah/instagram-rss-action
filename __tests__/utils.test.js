const { formatFeed, generateFeed } = require("../src/utils");
const feed = require("./fixtures/feed.json");
const hashtags = require("./fixtures/hashtags.json");
const video = require("./fixtures/video.json");

const metadata = {
  title: "Insta brunch",
};

it("formatFeed", () => {
  expect(formatFeed(feed, "katydecorah")).toMatchSnapshot();
  expect(formatFeed(hashtags, "eddiefs_eatery")).toMatchSnapshot();
  expect(formatFeed(video, "tatutacony")).toMatchSnapshot();
});

it("generateFeed", () => {
  const posts = formatFeed(feed, "katydecorah");
  expect(generateFeed(posts, metadata)).toMatchSnapshot();
});
