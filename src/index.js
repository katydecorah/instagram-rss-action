const core = require("@actions/core");
// const github = require("@actions/github");
const Instagram = require("instagram-web-api");
const { writeFile } = require("fs");
const { formatFeed, generateFeed } = require("./utils");

async function feed() {
  try {
    const fileName = core.getInput("readFileName") || "feed.json";
    const username = core.getInput("instagramHandle");
    const handles = core.getInput("handles").split(",");
    const feedTitle = core.getInput("feedTitle") || "Insta brunch";

    const metadata = {
      title: feedTitle,
      description: `Instagram posts for ${handles.join(", ")}.`,
    };

    const client = new Instagram({ username });

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
    await writeFile(fileName, JSON.stringify(build, null, 2));
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = feed();
