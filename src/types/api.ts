export interface ApiMeta {
  page?: number;
  pageSize?: number;
  total?: number;
}

export interface ApiSuccess<T> {
  data: T;
  meta?: ApiMeta;
}

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "NOT_FOUND"
  | "SLOT_UNAVAILABLE"
  | "SERVER_ERROR"
  | "NETWORK_ERROR";

export interface FieldError {
  field: string;
  message: string;
}

export interface ApiErrorBody {
  code: ApiErrorCode;
  message: string;
  fieldErrors?: FieldError[];
}

//This is a custom error class for API errors.
export class ApiError extends Error {
  readonly status: number;
  readonly code: ApiErrorCode;
  readonly fieldErrors?: FieldError[];

  constructor(status: number, body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = status;
    this.code = body.code;
    this.fieldErrors = body.fieldErrors;
  }
}

//This is a discriminated result type used internally by hooks that prefer not to throw.
export type ApiResult<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: ApiError };
