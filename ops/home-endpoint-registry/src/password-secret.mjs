import { PublisherError } from "./errors.mjs";

export const LEGACY_MINIMUM_PASSWORD_CHARACTERS = 10;
export const MAXIMUM_PASSWORD_CHARACTERS = 1024;

export function validatePasswordSecret(password) {
  if (
    typeof password !== "string" ||
    password.includes("\0") ||
    password.includes("\r") ||
    password.includes("\n")
  ) {
    throw new PublisherError("INVALID_PASSWORD_SECRET", "Password secret is invalid.");
  }

  const characterCount = Array.from(password).length;
  if (
    characterCount < LEGACY_MINIMUM_PASSWORD_CHARACTERS ||
    characterCount > MAXIMUM_PASSWORD_CHARACTERS
  ) {
    throw new PublisherError(
      "INVALID_PASSWORD_SECRET",
      `Password secret must contain between ${LEGACY_MINIMUM_PASSWORD_CHARACTERS} and ${MAXIMUM_PASSWORD_CHARACTERS} Unicode characters.`,
    );
  }
  return password;
}
