export class PublisherError extends Error {
  constructor(code, message, options = {}) {
    super(message, options);
    this.name = "PublisherError";
    this.code = code;
  }
}

export function errorCode(error) {
  return error instanceof PublisherError ? error.code : "UNEXPECTED_ERROR";
}
