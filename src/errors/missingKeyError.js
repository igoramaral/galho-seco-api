class MissingFieldError extends Error {
    constructor(field, message = "Campo obrigatório ausente") {
      super(message);
      this.name = "MissingKeyError";
      this.field = field;
      this.statusCode = 400; // Bad Request
    }
  }
  
  module.exports = MissingFieldError;