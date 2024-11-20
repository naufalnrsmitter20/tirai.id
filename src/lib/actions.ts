"use server";

const ErrorCode = {
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  SERVER_ERROR: "SERVER_ERROR",
} as const;

type ErrorCodeType = (typeof ErrorCode)[keyof typeof ErrorCode];

export type ActionError = {
  code: ErrorCodeType;
  message: string;
  field?: string;
};

export async function createError(
  code: ErrorCodeType,
  message: string,
  field?: string,
): Promise<ActionError> {
  return { code, message, field };
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActionResponse<T = any> = {
  success: boolean;
  data?: T;
  error?: ActionError;
};

export async function ActionResponses() {
  return {
    async success<T>(data: T): Promise<ActionResponse<T>> {
      return {
        success: true,
        data,
      };
    },

    async error(error: ActionError): Promise<ActionResponse> {
      return {
        success: false,
        error,
      };
    },

    async badRequest(message: string, field?: string): Promise<ActionResponse> {
      return {
        success: false,
        error: await createError(ErrorCode.BAD_REQUEST, message, field),
      };
    },

    async notFound(message: string): Promise<ActionResponse> {
      return {
        success: false,
        error: await createError(ErrorCode.NOT_FOUND, message),
      };
    },

    async unauthorized(message = "Forbidden"): Promise<ActionResponse> {
      return {
        success: false,
        error: await createError(ErrorCode.FORBIDDEN, message),
      };
    },

    async serverError(
      message = "Internal server error",
    ): Promise<ActionResponse> {
      return {
        success: false,
        error: await createError(ErrorCode.SERVER_ERROR, message),
      };
    },
  };
}
