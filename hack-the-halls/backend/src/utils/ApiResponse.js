class ApiResponse {
  /**
   * @constructor
   * @param {number} statusCode - HTTP status code
   * @param {*} data - Response data
   * @param {string} [message="Success"] - Response message
   */
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode; // HTTP status code
    this.data = data; // Response data
    this.message = message; // Response message
    this.success = statusCode < 400; // Indicates success if statusCode is less than 400
  }
}

export { ApiResponse };
