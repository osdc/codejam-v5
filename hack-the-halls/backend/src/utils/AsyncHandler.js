export const AsyncHandler = (fn) => async (req, res, next) => {
  try {
    // Execute the passed asynchronous function
    return await fn(req, res, next);
  } catch (error) {
    console.log("******** Inside AsyncHandler ********");
    console.log("Error: ", error);

    // Handle errors and respond with appropriate status and message
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
