# Data Validation Library

## Description

This library is designed for validating complex data structures in JavaScript. It supports primitive types (string, number, boolean, date), arrays, objects, nested structures, optional fields, custom error messages, and chainable validators.

## Installation and Usage

1. Go to the `task 8` folder:
   ```sh
   cd "task 8"
   ```
2. Run the tests:
   ```sh
   node schema.test.js
   ```
   If all tests pass, you will see `All tests passed!`.

## Usage Example

```js
const { Schema } = require("./schema");

const addressSchema = Schema.object({
  street: Schema.string(),
  city: Schema.string(),
  postalCode: Schema.string()
    .pattern(/^[0-9]{5}$/)
    .withMessage("Postal code must be 5 digits"),
  country: Schema.string(),
});

const userSchema = Schema.object({
  id: Schema.string().withMessage("ID must be a string"),
  name: Schema.string().minLength(2).maxLength(50),
  email: Schema.string().pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
  age: Schema.number().optional(),
  isActive: Schema.boolean(),
  tags: Schema.array(Schema.string()),
  address: addressSchema.optional(),
  metadata: Schema.object({}).optional(),
});

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
    country: "USA",
  },
};

const result = userSchema.validate(userData);
console.log(result);
// { valid: true, errors: [] }
```

## Validator API

- **StringValidator**: minLength, maxLength, pattern, optional, withMessage
- **NumberValidator**: min, max, optional, withMessage
- **BooleanValidator**: optional, withMessage
- **DateValidator**: optional, withMessage
- **ArrayValidator**: accepts a validator for array items
- **ObjectValidator**: accepts a schema of validators

Each validator supports the `validate(value)` method, which returns `{ valid: boolean, errors: string[] }`.

## Tests

Tests cover all main scenarios and edge cases. To run the tests:

```sh
node schema.test.js
```

## Test Coverage

Test coverage is 100% for all main validators and their combinations. See `test_report.txt` for details.
