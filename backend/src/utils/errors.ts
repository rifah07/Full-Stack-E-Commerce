import AppError from "./AppError";

export class BadRequestError extends AppError {
  constructor(message: string = "Bad Request") {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
  }
}

export class PaymentRequiredError extends AppError {
  constructor(message: string = "Payment Required") {
    super(message, 402);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = "Not Found") {
    super(message, 404);
  }
}

export class MethodNotAllowedError extends AppError {
  constructor(message: string = "Method Not Allowed") {
    super(message, 405);
  }
}

export class NotAcceptableError extends AppError {
  constructor(message: string = "Not Acceptable") {
    super(message, 406);
  }
}

export class ProxyAuthenticationRequiredError extends AppError {
  constructor(message: string = "Proxy Authentication Required") {
    super(message, 407);
  }
}

export class RequestTimeoutError extends AppError {
  constructor(message: string = "Request Timeout") {
    super(message, 408);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = "Conflict") {
    super(message, 409);
  }
}

export class GoneError extends AppError {
  constructor(message: string = "Gone") {
    super(message, 410);
  }
}

export class LengthRequiredError extends AppError {
  constructor(message: string = "Length Required") {
    super(message, 411);
  }
}

export class PreconditionFailedError extends AppError {
  constructor(message: string = "Precondition Failed") {
    super(message, 412);
  }
}

export class PayloadTooLargeError extends AppError {
  constructor(message: string = "Payload Too Large") {
    super(message, 413);
  }
}

export class URITooLongError extends AppError {
  constructor(message: string = "URI Too Long") {
    super(message, 414);
  }
}

export class UnsupportedMediaTypeError extends AppError {
  constructor(message: string = "Unsupported Media Type") {
    super(message, 415);
  }
}

export class RangeNotSatisfiableError extends AppError {
  constructor(message: string = "Range Not Satisfiable") {
    super(message, 416);
  }
}

export class ExpectationFailedError extends AppError {
  constructor(message: string = "Expectation Failed") {
    super(message, 417);
  }
}

export class TeapotError extends AppError {
  constructor(message: string = "I'm a Teapot") {
    super(message, 418);
  }
}

export class MisdirectedRequestError extends AppError {
  constructor(message: string = "Misdirected Request") {
    super(message, 421);
  }
}

export class UnprocessableEntityError extends AppError {
  constructor(message: string = "Unprocessable Entity") {
    super(message, 422);
  }
}

export class LockedError extends AppError {
  constructor(message: string = "Locked") {
    super(message, 423);
  }
}

export class FailedDependencyError extends AppError {
  constructor(message: string = "Failed Dependency") {
    super(message, 424);
  }
}

export class TooEarlyError extends AppError {
  constructor(message: string = "Too Early") {
    super(message, 425);
  }
}

export class UpgradeRequiredError extends AppError {
  constructor(message: string = "Upgrade Required") {
    super(message, 426);
  }
}

export class PreconditionRequiredError extends AppError {
  constructor(message: string = "Precondition Required") {
    super(message, 428);
  }
}

export class TooManyRequestsError extends AppError {
  constructor(message: string = "Too Many Requests") {
    super(message, 429);
  }
}

export class RequestHeaderFieldsTooLargeError extends AppError {
  constructor(message: string = "Request Header Fields Too Large") {
    super(message, 431);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = "Internal Server Error") {
    super(message, 500);
  }
}

export class NotImplementedError extends AppError {
  constructor(message: string = "Not Implemented") {
    super(message, 501);
  }
}

export class BadGatewayError extends AppError {
  constructor(message: string = "Bad Gateway") {
    super(message, 502);
  }
}

export class ServiceUnavailableError extends AppError {
  constructor(message: string = "Service Unavailable") {
    super(message, 503);
  }
}

export class GatewayTimeoutError extends AppError {
  constructor(message: string = "Gateway Timeout") {
    super(message, 504);
  }
}

export class HTTPVersionNotSupportedError extends AppError {
  constructor(message: string = "HTTP Version Not Supported") {
    super(message, 505);
  }
}

export class VariantAlsoNegotiatesError extends AppError {
  constructor(message: string = "Variant Also Negotiates") {
    super(message, 506);
  }
}

export class InsufficientStorageError extends AppError {
  constructor(message: string = "Insufficient Storage") {
    super(message, 507);
  }
}

export class LoopDetectedError extends AppError {
  constructor(message: string = "Loop Detected") {
    super(message, 508);
  }
}

export class NotExtendedError extends AppError {
  constructor(message: string = "Not Extended") {
    super(message, 510);
  }
}

export class NetworkAuthenticationRequiredError extends AppError {
  constructor(message: string = "Network Authentication Required") {
    super(message, 511);
  }
}
