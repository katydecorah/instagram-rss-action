import { removeEmoji, removeHashTags } from "../remover.js";

it("removeEmoji", () => {
  expect(removeEmoji("🧹")).toEqual("");
  expect(removeEmoji("🧪")).toEqual("");
  expect(removeEmoji("🧹🧪")).toEqual("");
  expect(removeEmoji("🧹🧪🧪")).toEqual("");
  expect(removeEmoji("🧹👨‍🏫🧪")).toEqual("");
});

it("removeHashTags", () => {
  expect(removeHashTags("#cool")).toEqual("");
  expect(removeHashTags("#cool #fun")).toEqual("");
  expect(removeHashTags("#cool #fun #awesome")).toEqual("");
  expect(removeHashTags("#too#close")).toEqual("");
  expect(removeHashTags("very#too#close")).toEqual("very");
  expect(removeHashTags("very#close")).toEqual("very");
});
