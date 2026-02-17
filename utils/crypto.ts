// A simple symmetric cipher for demonstration purposes.
// In a real-world application, use a robust, professionally audited library like CryptoJS or the browser's native SubtleCrypto API.
// This Vigenère cipher is more robust than a simple XOR but is still not considered cryptographically secure for production secrets.
const key = 'your-super-secret-key-that-is-long-and-random-roseforge';

class VigenereCipher {
  private key: string;

  constructor(key: string) {
    this.key = key.toUpperCase().replace(/[^A-Z]/g, '');
  }

  private process(input: string, action: 'encrypt' | 'decrypt'): string {
    let output = '';
    let keyIndex = 0;
    for (let i = 0; i < input.length; i++) {
      const charCode = input.charCodeAt(i);
      
      // We only encrypt/decrypt standard ASCII characters for simplicity
      if (charCode >= 32 && charCode <= 126) {
        const keyChar = this.key[keyIndex % this.key.length];
        const keyShift = keyChar.charCodeAt(0) - 'A'.charCodeAt(0);
        
        let processedCharCode;
        if (action === 'encrypt') {
          processedCharCode = charCode + keyShift;
        } else {
          processedCharCode = charCode - keyShift;
        }

        // Wrap around the printable ASCII range
        const range = 126 - 32 + 1;
        while (processedCharCode > 126) processedCharCode -= range;
        while (processedCharCode < 32) processedCharCode += range;

        output += String.fromCharCode(processedCharCode);
        keyIndex++;
      } else {
        // Pass through non-printable characters as-is
        output += input.charAt(i);
      }
    }
    return output;
  }
  
  encrypt(text: string): string {
    return this.process(text, 'encrypt');
  }
  
  decrypt(text: string): string {
    return this.process(text, 'decrypt');
  }
}

const cipher = new VigenereCipher(key);


export function encrypt(data: any): string {
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = cipher.encrypt(jsonString);
    // Use unescape and encodeURIComponent to handle non-Latin1 characters before btoa.
    // This is a common and robust pattern for handling Unicode with btoa.
    return btoa(unescape(encodeURIComponent(encrypted)));
  } catch (error) {
    console.error("Encryption failed", error);
    return '';
  }
}

export function decrypt(encryptedData: string): any {
  try {
    // Reverse the process: atob, then decode the URI-escaped string
    const fromBase64 = atob(encryptedData);
    // The 'escape' function is deprecated but is the correct counterpart to 'unescape' for this pattern.
    const decryptedUri = decodeURIComponent(escape(fromBase64));
    const decrypted = cipher.decrypt(decryptedUri);
    return JSON.parse(decrypted);
  } catch (error) {
    // This can happen if data is not encrypted, corrupted, or was encrypted with the old method.
    // Fallback for old XOR method for graceful migration
    try {
        const fromBase64 = atob(encryptedData);
        let output = '';
        const oldKey = 'your-super-secret-key-that-is-long-and-random';
        for (let i = 0; i < fromBase64.length; i++) {
            const charCode = fromBase64.charCodeAt(i) ^ oldKey.charCodeAt(i % oldKey.length);
            output += String.fromCharCode(charCode);
        }
        return JSON.parse(output);
    } catch (migrationError) {
         try {
            // Final fallback for data that might have been only base64 encoded
            const decoded = atob(encryptedData);
            return JSON.parse(decoded);
        } catch (finalError) {
            console.error("All decryption and parsing fallbacks failed.", finalError);
            return null;
        }
    }
  }
}
