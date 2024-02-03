type ErrorWithStatusCode = {
  statusCode: number;
};

function isErrorWithStatusCode(error: unknown): error is ErrorWithStatusCode {
  return (
    typeof error === "object" &&
    error !== null &&
    "statusCode" in error &&
    typeof (error as Record<string, unknown>).statusCode === "number"
  );
}

function toErrorWithStatusCode(maybeError: unknown): ErrorWithStatusCode {
  if (isErrorWithStatusCode(maybeError)) return maybeError;
  else return { statusCode: 500 };
}

export function getErrorStatusCode(error: unknown) {
  return toErrorWithStatusCode(error).statusCode;
}
