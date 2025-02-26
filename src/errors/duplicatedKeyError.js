class DuplicateKeyError extends Error {
    constructor(field, message = "Chave duplicada") {
      super(message);
      this.name = "DuplicateKeyError";
      this.field = field;
      this.statusCode = 400; 
    }
  }
  
  module.exports = DuplicateKeyError;