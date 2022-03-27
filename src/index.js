import { getInput, warning, setFailed, setOutput } from "@actions/core";
import Instagram from "instagram-web-api";
import { writeFile } from "fs";
import { formatFeed, generateFeed } from "./utils";

async function feed() {
  try {
    const fileName = getInput("fileName");
    const username = getInput("yourInstagram");
    const handles = getInput("listOfInstagrams").split(",");
    const feedTitle = getInput("feedTitle");
    const pretty = getInput("pretty");

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
        warning(error);
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
          if (error) return setFailed(error);
          setOutput("RSS_STATUS", "success");
          return result;
        }
      );
    }
  } catch (error) {
    setFailed(error.message);
  }
}

export default feed();
