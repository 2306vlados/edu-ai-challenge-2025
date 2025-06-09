# Enigma Machine Bug Fix

## Bug Description

The main bug in the Enigma machine implementation was in the `encryptChar` method of the `Enigma` class. The plugboard transformation was only being applied once at the beginning of the encryption process, but according to the historical Enigma machine design, the signal should pass through the plugboard **twice**:

1. **Before** entering the rotors (which was correctly implemented)
2. **After** exiting the rotors on the return path (which was missing)

## Root Cause

In the original code, line 85 in the `encryptChar` method:

```javascript
encryptChar(c) {
  if (!alphabet.includes(c)) return c;
  this.stepRotors();
  c = plugboardSwap(c, this.plugboardPairs);  // First plugboard pass ✓
  for (let i = this.rotors.length - 1; i >= 0; i--) {
    c = this.rotors[i].forward(c);
  }

  c = REFLECTOR[alphabet.indexOf(c)];

  for (let i = 0; i < this.rotors.length; i++) {
    c = this.rotors[i].backward(c);
  }
  // Missing second plugboard pass! ❌
  return c;
}
```

## Fix Applied

Added the missing second plugboard swap after the backward pass through the rotors:

```javascript
encryptChar(c) {
  if (!ALPHABET.includes(c)) return c;

  this.stepRotors();

  // First plugboard pass
  c = plugboardSwap(c, this.plugboardPairs);

  // Forward through rotors
  for (let i = this.rotors.length - 1; i >= 0; i--) {
    c = this.rotors[i].forward(c);
  }

  // Reflector
  c = REFLECTOR[ALPHABET.indexOf(c)];

  // Backward through rotors
  for (let i = 0; i < this.rotors.length; i++) {
    c = this.rotors[i].backward(c);
  }

  // Second plugboard pass (FIXED!)
  c = plugboardSwap(c, this.plugboardPairs);

  return c;
}
```

## Impact

This bug caused incorrect encryption/decryption results when plugboard pairs were configured. Without this fix:

- Messages with plugboard settings would not decrypt back to the original text
- The Enigma machine's reciprocal property (encrypt(encrypt(text)) = text) was broken
- Historical accuracy was compromised

## Verification

The fix ensures that:

1. Encryption and decryption produce correct results
2. The Enigma machine maintains its reciprocal property
3. Plugboard functionality works as historically intended
4. All test cases pass with expected outputs
