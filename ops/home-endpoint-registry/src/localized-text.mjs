import { PublisherError } from "./errors.mjs";
import { assertExactKeys } from "./validation.mjs";

function validateText(value, label, maximumLength) {
  if (
    typeof value !== "string" ||
    value !== value.trim() ||
    value.length < 1 ||
    [...value].length > maximumLength ||
    /[\u0000-\u001f\u007f-\u009f]/u.test(value)
  ) {
    throw new PublisherError("INVALID_LOCALIZED_TEXT", `${label} is invalid.`);
  }
  return value;
}

export function validateLocalizedText(value, label, maximumLength) {
  assertExactKeys(value, ["en", "zh"], label);
  return {
    en: validateText(value.en, `${label} English text`, maximumLength),
    zh: validateText(value.zh, `${label} Chinese text`, maximumLength),
  };
}
