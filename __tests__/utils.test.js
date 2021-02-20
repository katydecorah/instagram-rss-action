const { formatFeed, generateFeed } = require("../src/utils");
const feed = require("./fixtures/feed.json");

it("formatFeed", () => {
  expect(formatFeed(feed, "katydecorah")).toMatchSnapshot();
});

it("generateFeed", () => {
  const posts = formatFeed(feed, "katydecorah");
  expect(generateFeed(posts)).toMatchSnapshot();
});
