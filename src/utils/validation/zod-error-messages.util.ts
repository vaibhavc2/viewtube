const requiredError = (fieldName: string) => {
  return fieldName + " can't be empty! Please fill in all the required fields.";
};

const largeStringError = (fieldName: string, max: number) => {
  return fieldName + " must not exceed " + max + " characters.";
};

const minStringError = (fieldName: string, min: number) => {
  return fieldName + " must be at least " + min + " characters.";
};

export { largeStringError, minStringError, requiredError };
