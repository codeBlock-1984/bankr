class Responder {
  static successResponse(responseData) {
    return {
      data: responseData,
    };
  }

  static messageResponse(messageData) {
    return {
      message: messageData,
    };
  }

  static errorResponse(responseError) {
    return {
      error: responseError,
    };
  }
}

export default Responder;
