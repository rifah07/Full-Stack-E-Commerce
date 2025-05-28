// Common response schemas
export default {
  SuccessResponse: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "success",
      },
      message: {
        type: "string",
        example: "Operation completed successfully",
      },
      data: {
        type: "object",
        description: "Response data (varies by endpoint)",
      },
    },
  },

  // Pagination Schema
  PaginationMeta: {
    type: "object",
    properties: {
      page: {
        type: "integer",
        example: 1,
      },
      limit: {
        type: "integer",
        example: 10,
      },
      totalPages: {
        type: "integer",
        example: 5,
      },
      totalItems: {
        type: "integer",
        example: 50,
      },
      hasNextPage: {
        type: "boolean",
        example: true,
      },
      hasPrevPage: {
        type: "boolean",
        example: false,
      },
    },
  },

  // Error Response Schemas
  ErrorResponse: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "error",
      },
      message: {
        type: "string",
        example: "Something went wrong",
      },
      statusCode: {
        type: "integer",
        example: 500,
      },
    },
  },

  Error400: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "error",
      },
      message: {
        type: "string",
        example: "Bad Request - Invalid input data",
      },
      statusCode: {
        type: "integer",
        example: 400,
      },
    },
  },

  Error401: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "error",
      },
      message: {
        type: "string",
        example: "Unauthorized - Authentication required",
      },
      statusCode: {
        type: "integer",
        example: 401,
      },
    },
  },

  Error403: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "error",
      },
      message: {
        type: "string",
        example: "Forbidden - Insufficient permissions",
      },
      statusCode: {
        type: "integer",
        example: 403,
      },
    },
  },

  Error404: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "error",
      },
      message: {
        type: "string",
        example: "Not Found - Resource does not exist",
      },
      statusCode: {
        type: "integer",
        example: 404,
      },
    },
  },

  Error409: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "error",
      },
      message: {
        type: "string",
        example: "Conflict - Resource already exists",
      },
      statusCode: {
        type: "integer",
        example: 409,
      },
    },
  },

  Error422: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "error",
      },
      message: {
        type: "string",
        example: "Unprocessable Entity - Validation failed",
      },
      statusCode: {
        type: "integer",
        example: 422,
      },
      errors: {
        type: "array",
        items: {
          type: "object",
          properties: {
            field: {
              type: "string",
              example: "email",
            },
            message: {
              type: "string",
              example: "Email is required",
            },
          },
        },
      },
    },
  },

  Error429: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "error",
      },
      message: {
        type: "string",
        example: "Too Many Requests - Rate limit exceeded",
      },
      statusCode: {
        type: "integer",
        example: 429,
      },
    },
  },

  Error500: {
    type: "object",
    properties: {
      status: {
        type: "string",
        example: "error",
      },
      message: {
        type: "string",
        example: "Internal Server Error - Something went wrong on our end",
      },
      statusCode: {
        type: "integer",
        example: 500,
      },
    },
  },

  // Common field schemas
  ObjectId: {
    type: "string",
    pattern: "^[0-9a-fA-F]{24}$",
    example: "64a8b2c3f1d2e3a4b5c6d7e8",
    description: "MongoDB ObjectId",
  },

  Timestamp: {
    type: "string",
    format: "date-time",
    example: "2025-05-29T10:30:00.000Z",
    description: "ISO 8601 timestamp",
  },

  Email: {
    type: "string",
    format: "email",
    example: "user@example.com",
    description: "Valid email address",
  },

  Password: {
    type: "string",
    minLength: 8,
    example: "SecurePassword123!",
    description: "Password with minimum 8 characters",
  },
};