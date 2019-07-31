import express from "express";

interface IData  {
  data?: object | string;
  reason?: object | string;
}

class Responder {

  public static sendResponse(res: express.Response, status: number, body: IData, success?: boolean) {
    return res.status(status).json({
      data: body.data || [],
      error: !success,
      message: success  ? "Request successfully performed!!" : body.reason,
    });
  }

  public static success(res: express.Response , message) {
    message = typeof message === "string" ? { message } : message;
    return Responder.sendResponse(res, 200, {data: message}, true);
  }

  public static operationFailed(res: express.Response, reason) {
    const status = reason.status;
    reason = reason.message || reason;
    return Responder.sendResponse(res, status || 400, {reason});
  }
}

export default Responder;
