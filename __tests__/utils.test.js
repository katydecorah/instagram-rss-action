const { formatFeed, generateFeed } = require("../src/utils");
const feed = require("./fixtures/feed.json");
const hashtags = require("./fixtures/hashtags.json");
const video = require("./fixtures/video.json");
const slides = require("./fixtures/slides.json");

const metadata = {
  title: "Insta brunch",
};

describe("formatFeed", () => {
  expect(formatFeed(feed, "katydecorah", true)).toMatchSnapshot();
  it("hashtags", () => {
    expect(formatFeed(hashtags, "eddiefs_eatery", true)).toMatchSnapshot();
  });
  it("videos", () => {
    expect(formatFeed(video, "tatutacony", true)).toMatchSnapshot();
  });
  it("sidecar", () => {
    expect(formatFeed(slides, "draplin", true)).toMatchSnapshot();
  });

  it("turn off pretty", () => {
    expect(formatFeed(video, "tatutacony", false)).toMatchSnapshot();
  });
});

it("generateFeed", () => {
  const posts = formatFeed(feed, "katydecorah", true);
  expect(generateFeed(posts, metadata)).toMatchSnapshot();
});
