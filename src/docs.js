const { readFileSync, writeFileSync } = require("fs");
const yaml = require("js-yaml");

const { inputs } = yaml.load(readFileSync("./action.yml", "utf8"));
const docs = Object.keys(inputs)
  .map(
    (key) =>
      `- \`${key}\`: ${inputs[key].required ? "Required. " : ""}${
        inputs[key].description
      }${inputs[key].default ? ` Default: \`${inputs[key].default}\`.` : ""}\n`
  )
  .join("");

const readme = readFileSync("./README.md", "utf-8");
const regex = /<!-- START GENERATED OPTIONS -->([\s\S]*?)<!-- END GENERATED OPTIONS -->/gm;
const oldFile = readme.match(regex);
const newFile = readme.replace(
  oldFile,
  `<!-- START GENERATED OPTIONS -->
${docs}
<!-- END GENERATED OPTIONS -->`
);

writeFileSync("./README.md", newFile);
