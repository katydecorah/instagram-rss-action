import { formatFeed, generateFeed } from "../utils.js";
import feed from "./fixtures/feed.json";
import hashtags from "./fixtures/hashtags.json";
import video from "./fixtures/video.json";
import slides from "./fixtures/slides.json";

const metadata = {
  title: "Insta brunch",
};

describe("formatFeed", () => {
  it("regular", () => {
    expect(formatFeed(feed, "katydecorah", true)).toMatchSnapshot();
  });
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
