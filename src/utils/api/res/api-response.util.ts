class ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;

  constructor(statusCode: number, message?: string, data?: any) {
    this.statusCode = statusCode;
    this.message = message || "No message provided";
    this.data = data;
    this.success = statusCode < 400;
  }
}

export class SuccessResponse extends ApiResponse {
  constructor(message?: string, data?: any) {
    super(200, message || "Success", data);
  }
}

export class CreatedResponse extends ApiResponse {
  constructor(message?: string, data?: any) {
    super(201, message || "Created", data);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(message?: string, data?: any) {
    super(400, message || "Bad Request", data);
  }
}

export class UnauthorizedResponse extends ApiResponse {
  constructor(message?: string, data?: any) {
    super(401, message || "Unauthorized", data);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(message?: string, data?: any) {
    super(403, message || "Forbidden", data);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(message?: string, data?: any) {
    super(404, message || "Not Found", data);
  }
}

export class InternalServerErrorResponse extends ApiResponse {
  constructor(message?: string, data?: any) {
    super(500, message || "Something went wrong.", data);
  }
}

export default ApiResponse;
