class ApiError extends Error {
  /**
   * @constructor
   * @param {number} statusCode - HTTP status code
   * @param {string} [message="Something went wrong"] - Error message
   * @param {Array} [errors=[]] - Additional error details
   * @param {string} [stack=""] - Stack trace (optional)
   */
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message); // Call the Error constructor with the message
    this.statusCode = statusCode; // HTTP status code
    this.data = null; // Placeholder for potential data
    this.message = message; // Error message
    this.success = false; // Indicates failure
    this.errors = errors; // Additional error details

    // Capture stack trace if not provided
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
