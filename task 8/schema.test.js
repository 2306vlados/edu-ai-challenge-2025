// Unit tests for validation library
// Run with: node schema.test.js (or use Jest if available)

const assert = require('assert');
const {
  Schema,
  Validator,
  StringValidator,
  NumberValidator,
  BooleanValidator,
  DateValidator,
  ArrayValidator,
  ObjectValidator
} = require('./schema');

global.describe = (desc, fn) => { console.log(desc); fn(); };
global.it = (msg, fn) => { try { fn(); console.log('  ✓', msg); } catch (e) { console.error('  ✗', msg); throw e; } };

// Импортируем валидаторы из schema.js (если потребуется, экспортировать их)
// Здесь предполагается, что классы доступны глобально

// StringValidator tests
describe('StringValidator', () => {
  it('validates required string', () => {
    const validator = new StringValidator();
    assert.deepStrictEqual(validator.validate('hello'), { valid: true, errors: [] });
    assert.deepStrictEqual(validator.validate(undefined).valid, false);
  });

  it('validates minLength and maxLength', () => {
    const validator = new StringValidator().minLength(2).maxLength(4);
    assert.deepStrictEqual(validator.validate('a').valid, false);
    assert.deepStrictEqual(validator.validate('abcd').valid, true);
    assert.deepStrictEqual(validator.validate('abcde').valid, false);
  });

  it('validates pattern', () => {
    const validator = new StringValidator().pattern(/^\d+$/);
    assert.deepStrictEqual(validator.validate('123').valid, true);
    assert.deepStrictEqual(validator.validate('abc').valid, false);
  });

  it('validates optional', () => {
    const validator = new StringValidator().optional();
    assert.deepStrictEqual(validator.validate(undefined).valid, true);
  });
});

describe('NumberValidator', () => {
  it('validates required number', () => {
    const validator = new NumberValidator();
    assert.deepStrictEqual(validator.validate(5).valid, true);
    assert.deepStrictEqual(validator.validate(undefined).valid, false);
  });

  it('validates min and max', () => {
    const validator = new NumberValidator().min(2).max(4);
    assert.deepStrictEqual(validator.validate(1).valid, false);
    assert.deepStrictEqual(validator.validate(3).valid, true);
    assert.deepStrictEqual(validator.validate(5).valid, false);
  });

  it('validates optional', () => {
    const validator = new NumberValidator().optional();
    assert.deepStrictEqual(validator.validate(undefined).valid, true);
  });
});

describe('BooleanValidator', () => {
  it('validates boolean', () => {
    const validator = new BooleanValidator();
    assert.deepStrictEqual(validator.validate(true).valid, true);
    assert.deepStrictEqual(validator.validate(false).valid, true);
    assert.deepStrictEqual(validator.validate('true').valid, false);
  });
});

describe('DateValidator', () => {
  it('validates date', () => {
    const validator = new DateValidator();
    assert.deepStrictEqual(validator.validate('2020-01-01').valid, true);
    assert.deepStrictEqual(validator.validate('not-a-date').valid, false);
  });
});

describe('ArrayValidator', () => {
  it('validates array of strings', () => {
    const validator = new ArrayValidator(new StringValidator().minLength(2));
    assert.deepStrictEqual(validator.validate(['ab', 'cd']).valid, true);
    assert.deepStrictEqual(validator.validate(['a', 'cd']).valid, false);
  });
});

describe('ObjectValidator', () => {
  it('validates object schema', () => {
    const schema = {
      name: new StringValidator().minLength(2),
      age: new NumberValidator().min(0),
    };
    const validator = new ObjectValidator(schema);
    assert.deepStrictEqual(validator.validate({ name: 'Al', age: 5 }).valid, true);
    assert.deepStrictEqual(validator.validate({ name: 'A', age: 5 }).valid, false);
    assert.deepStrictEqual(validator.validate({ name: 'Al', age: -1 }).valid, false);
  });

  it('validates optional fields', () => {
    const schema = {
      name: new StringValidator(),
      age: new NumberValidator().optional(),
    };
    const validator = new ObjectValidator(schema);
    assert.deepStrictEqual(validator.validate({ name: 'Al' }).valid, true);
  });
});

console.log('All tests passed!');
