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

export class ApiSuccessResponse extends ApiResponse {
  constructor(message = "success", data: any) {
    super(200, message, data);
  }
}

export default ApiResponse;
