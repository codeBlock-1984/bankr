class Responder {
  static successResponse(msg, responseData) {
    return {
      message: msg,
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
