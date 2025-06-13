// Base Validator class
class Validator {
  constructor() {
    this._isOptional = false;
    this._customMessage = null;
  }

  optional() {
    this._isOptional = true;
    return this;
  }

  withMessage(message) {
    this._customMessage = message;
    return this;
  }

  _error(message) {
    return this._customMessage || message;
  }
}

// String Validator
class StringValidator extends Validator {
  constructor() {
    super();
    this._minLength = null;
    this._maxLength = null;
    this._pattern = null;
  }

  minLength(length) {
    this._minLength = length;
    return this;
  }

  maxLength(length) {
    this._maxLength = length;
    return this;
  }

  pattern(regex) {
    this._pattern = regex;
    return this;
  }

  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true, errors: [] };
      return { valid: false, errors: [this._error('Value is required')] };
    }
    if (typeof value !== 'string') {
      return { valid: false, errors: [this._error('Value must be a string')] };
    }
    if (this._minLength !== null && value.length < this._minLength) {
      return { valid: false, errors: [this._error(`Minimum length is ${this._minLength}`)] };
    }
    if (this._maxLength !== null && value.length > this._maxLength) {
      return { valid: false, errors: [this._error(`Maximum length is ${this._maxLength}`)] };
    }
    if (this._pattern && !this._pattern.test(value)) {
      return { valid: false, errors: [this._error('Value does not match pattern')] };
    }
    return { valid: true, errors: [] };
  }
}

// Number Validator
class NumberValidator extends Validator {
  constructor() {
    super();
    this._min = null;
    this._max = null;
  }

  min(value) {
    this._min = value;
    return this;
  }

  max(value) {
    this._max = value;
    return this;
  }

  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true, errors: [] };
      return { valid: false, errors: [this._error('Value is required')] };
    }
    if (typeof value !== 'number' || isNaN(value)) {
      return { valid: false, errors: [this._error('Value must be a number')] };
    }
    if (this._min !== null && value < this._min) {
      return { valid: false, errors: [this._error(`Minimum value is ${this._min}`)] };
    }
    if (this._max !== null && value > this._max) {
      return { valid: false, errors: [this._error(`Maximum value is ${this._max}`)] };
    }
    return { valid: true, errors: [] };
  }
}

// Boolean Validator
class BooleanValidator extends Validator {
  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true, errors: [] };
      return { valid: false, errors: [this._error('Value is required')] };
    }
    if (typeof value !== 'boolean') {
      return { valid: false, errors: [this._error('Value must be a boolean')] };
    }
    return { valid: true, errors: [] };
  }
}

// Date Validator
class DateValidator extends Validator {
  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true, errors: [] };
      return { valid: false, errors: [this._error('Value is required')] };
    }
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return { valid: false, errors: [this._error('Value must be a valid date')] };
    }
    return { valid: true, errors: [] };
  }
}

// Array Validator
class ArrayValidator extends Validator {
  constructor(itemValidator) {
    super();
    this._itemValidator = itemValidator;
  }

  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true, errors: [] };
      return { valid: false, errors: [this._error('Value is required')] };
    }
    if (!Array.isArray(value)) {
      return { valid: false, errors: [this._error('Value must be an array')] };
    }
    let errors = [];
    value.forEach((item, idx) => {
      const result = this._itemValidator.validate(item);
      if (!result.valid) {
        errors.push(`Item at index ${idx}: ${result.errors.join(', ')}`);
      }
    });
    return { valid: errors.length === 0, errors };
  }
}

// Object Validator
class ObjectValidator extends Validator {
  constructor(schema) {
    super();
    this._schema = schema;
  }

  validate(value) {
    if (value === undefined || value === null) {
      if (this._isOptional) return { valid: true, errors: [] };
      return { valid: false, errors: [this._error('Value is required')] };
    }
    if (typeof value !== 'object' || Array.isArray(value)) {
      return { valid: false, errors: [this._error('Value must be an object')] };
    }
    let errors = [];
    for (const key in this._schema) {
      const validator = this._schema[key];
      const result = validator.validate(value[key]);
      if (!result.valid) {
        errors.push(`${key}: ${result.errors.join(', ')}`);
      }
    }
    return { valid: errors.length === 0, errors };
  }
}

// Schema Builder
class Schema {
    static string() {
      return new StringValidator();
    }
    
    static number() {
      return new NumberValidator();
    }
    
    static boolean() {
      return new BooleanValidator();
    }
    
    static date() {
      return new DateValidator();
    }
    
    static object(schema) {
      return new ObjectValidator(schema);
    }
    
    static array(itemValidator) {
      return new ArrayValidator(itemValidator);
    }
  }
  
  // Define a complex schema
  const addressSchema = Schema.object({
    street: Schema.string(),
    city: Schema.string(),
    postalCode: Schema.string().pattern(/^[0-9]{5}$/).withMessage('Postal code must be 5 digits'),
    country: Schema.string()
  });
  
  const userSchema = Schema.object({
    id: Schema.string().withMessage('ID must be a string'),
    name: Schema.string().minLength(2).maxLength(50),
    email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    age: Schema.number().optional(),
    isActive: Schema.boolean(),
    tags: Schema.array(Schema.string()),
    address: addressSchema.optional(),
    metadata: Schema.object({}).optional()
  });
  
  // Validate data
  const userData = {
    id: "12345",
    name: "John Doe",
    email: "john@example.com",
    isActive: true,
    tags: ["developer", "designer"],
    address: {
      street: "123 Main St",
      city: "Anytown",
      postalCode: "12345",
      country: "USA"
    }
  };
  
  const result = userSchema.validate(userData);
  
// Export validators and Schema for testing and usage
module.exports = {
  Schema,
  Validator,
  StringValidator,
  NumberValidator,
  BooleanValidator,
  DateValidator,
  ArrayValidator,
  ObjectValidator
};
  