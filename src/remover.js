const emojiRegex = require("emoji-regex");

function removeEmoji(str) {
  if (!str) return;
  const regex = emojiRegex();
  let strippedStr = str;
  let match;
  while ((match = regex.exec(str))) {
    const emoji = match[0];
    strippedStr = strippedStr.replace(emoji, "");
  }
  return strippedStr;
}

function removeHashTags(str) {
  return str
    .split(" ")
    .filter((word) => !word.startsWith("#"))
    .reduce(
      (arr, word) => [
        ...arr,
        ...(word.split("#").length > 0 ? [word.split("#")[0]] : word),
      ],
      []
    )
    .join(" ");
}

module.exports = {
  removeEmoji,
  removeHashTags,
};
