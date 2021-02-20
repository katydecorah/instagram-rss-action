const Instagram = require("instagram-web-api");
const { writeFileSync } = require("fs");
const { formatFeed, generateFeed } = require("./utils");

const username = "katydecorah";
const client = new Instagram({ username });

const handles = ["nextdoorkitchenandbar", "flatbread.social"];

(async function () {
  let all = [];
  for (const handle of handles) {
    const posts = await client.getPhotosByUsername({ username: handle });
    const format = formatFeed(posts, handle);
    all = [...all, ...format];
  }
  all = all.sort((a, b) => new Date(b.date) - new Date(a.date)).reverse();
  const build = generateFeed(all);
  writeFileSync(`feed.json`, JSON.stringify(build, null, 2));
})();
