// custom class for error-handling

class ErrorHandler extends Error {
  // ErrorHandler inherits everything from Error class
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message); // calls parent class constructor
    this.statusCode = statusCode;
  }
}

export default ErrorHandler;
