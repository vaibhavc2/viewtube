class ApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: any;

  constructor(statusCode: number, message = "success", data: any) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = statusCode < 400;
  }
}

export class SuccessResponse extends ApiResponse {
  constructor(message = "success", data: any) {
    super(200, message, data);
  }
}

export class BadRequestResponse extends ApiResponse {
  constructor(message = "Bad Request", data: any) {
    super(400, message, data);
  }
}

export class UnauthorizedResponse extends ApiResponse {
  constructor(message = "Unauthorized", data: any) {
    super(401, message, data);
  }
}

export class ForbiddenResponse extends ApiResponse {
  constructor(message = "Forbidden", data: any) {
    super(403, message, data);
  }
}

export class NotFoundResponse extends ApiResponse {
  constructor(message = "Not Found", data: any) {
    super(404, message, data);
  }
}

export class InternalServerErrorResponse extends ApiResponse {
  constructor(message = "Internal Server Error", data: any) {
    super(500, message, data);
  }
}

export class NotImplementedResponse extends ApiResponse {
  constructor(message = "Not Implemented", data: any) {
    super(501, message, data);
  }
}

export default ApiResponse;
