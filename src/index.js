const core = require("@actions/core");
const Instagram = require("instagram-web-api");
const { writeFile } = require("fs");
const { formatFeed, generateFeed } = require("./utils");

async function feed() {
  try {
    const fileName = core.getInput("fileName");
    const username = core.getInput("yourInstagram");
    const handles = core.getInput("listOfInstagrams").split(",");
    const feedTitle = core.getInput("feedTitle");
    const pretty = core.getInput("pretty");

    const metadata = {
      title: feedTitle,
      description: `Instagram posts for ${handles.join(", ")}.`,
    };
    const client = new Instagram({ username });

    let allPosts = [];
    for (const handle of handles) {
      try {
        const posts = await client.getPhotosByUsername({ username: handle });
        const formattedPosts = formatFeed(posts, handle, pretty);
        allPosts = [...allPosts, ...formattedPosts];
      } catch (error) {
        core.warning(error);
      }
    }
    if (allPosts.length) {
      allPosts = allPosts
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .reverse();
      const build = generateFeed(allPosts, metadata);
      await writeFile(
        fileName,
        JSON.stringify(build, null, 2),
        (error, result) => {
          if (error) return core.setFailed(error);
          core.setOutput("RSS_STATUS", "success");
          return result;
        }
      );
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = feed();
