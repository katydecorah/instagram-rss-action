const { readFileSync, writeFileSync } = require("fs");
const { version } = require("../package.json");
const yaml = require("js-yaml");

function writeDocs(doc, name) {
  const readme = readFileSync("./README.md", "utf-8");
  const comment = {
    start: `<!-- START GENERATED ${name} -->`,
    end: `<!-- END GENERATED ${name} -->`,
  };

  const regex = new RegExp(`${comment.start}([\\s\\S]*?)${comment.end}`, "gm");
  const oldFile = readme.match(regex);
  const newFile = readme.replace(
    oldFile,
    `${comment.start}
${doc}
${comment.end}`
  );
  writeFileSync("./README.md", newFile);
}

// SETUP

let yml = yaml.load(readFileSync("./.github/workflows/rss.yml", "utf8"));
delete yml.on.push;
yml.jobs.generate_rss.steps = yml.jobs.generate_rss.steps.reduce(
  (arr, step) => {
    if (step.name === "RSS") {
      step.uses = `katydecorah/instagram-rss-action@v${version}`;
      step.with.yourInstagram = "YOUR-INSTRAGRAM";
    }
    arr.push(step);
    return arr;
  },
  []
);
writeDocs(
  `\`\`\`yml
${yaml.dump(yml)}
\`\`\`
`,
  "SETUP"
);

// INPUT
const { inputs } = yaml.load(readFileSync("./action.yml", "utf8"));
const docs = Object.keys(inputs)
  .map(
    (key) =>
      `- \`${key}\`: ${inputs[key].required ? "Required. " : ""}${
        inputs[key].description
      }${inputs[key].default ? ` Default: \`${inputs[key].default}\`.` : ""}\n`
  )
  .join("");
writeDocs(docs, "OPTIONS");