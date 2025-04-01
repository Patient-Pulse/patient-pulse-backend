import mapDbError from "./errHandler.js";

const sendSuccessResponse = (res, statusCode, message, data = null) => {
    return res.status(statusCode).json({
        status: "success",
        message,
        data
    });
};

const sendErrorResponse = (res, err, env = process.env.NODE_ENV) => {
    const { status, message } = mapDbError(err);

    return res.status(status).json({
        status: "error",
        message,
        details: env === "development" ? err.message : undefined
    });
};

export { sendSuccessResponse, sendErrorResponse };
