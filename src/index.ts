import { getInput, warning, setFailed, setOutput } from "@actions/core";
import Instagram from "instagram-web-api";
import { writeFile } from "fs/promises";
import { Feed, formatFeed, generateFeed } from "./utils.js";

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

    let allPosts: Feed[] | [] = [];

    for (const handle of handles) {
      try {
        const posts = await client.getPhotosByUsername({ username: handle });
        const formattedPosts = formatFeed(posts, handle, pretty === "true");
        if (formattedPosts) allPosts = [...allPosts, ...formattedPosts];
      } catch (error) {
        warning(error);
      }
    }
    if (!allPosts.length) return;
    allPosts = allPosts
      .sort(
        (a: { date: Date }, b: { date: Date }) =>
          new Date(b.date).valueOf() - new Date(a.date).valueOf()
      )
      .reverse();
    const build = generateFeed(allPosts, metadata);

    try {
      await writeFile(fileName, JSON.stringify(build, null, 2));
      setOutput("RSS_STATUS", "success");
    } catch (error) {
      throw new Error(error);
    }
  } catch (error) {
    setFailed(error.message);
  }
}

export default feed();
