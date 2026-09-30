import { AppUtilities } from './app.utilities';
import * as bcrypt from 'bcrypt';

describe('AppUtilities', () => {
  describe('removeSensitiveData', () => {
    it('should remove specified property from array of objects', () => {
      const users = [
        { id: '1', name: 'Alice', password: 'hash1' },
        { id: '2', name: 'Bob', password: 'hash2' },
      ];
      const result = AppUtilities.removeSensitiveData(users, 'password');
      expect(result).toEqual([
        { id: '1', name: 'Alice' },
        { id: '2', name: 'Bob' },
      ]);
    });

    it('should remove specified property from a single object', () => {
      const user = { id: '1', name: 'Alice', password: 'hash1' };
      const result = AppUtilities.removeSensitiveData(user, 'password');
      expect(result).toEqual({ id: '1', name: 'Alice' });
    });

    it('should return non-object as-is safely', () => {
      expect(AppUtilities.removeSensitiveData(null, 'password')).toBeNull();
      expect(AppUtilities.removeSensitiveData(undefined, 'password')).toBeUndefined();
      expect(AppUtilities.removeSensitiveData('string', 'password')).toBe('string');
    });
  });

  describe('removePasswordForAuthorSelect', () => {
    it('should return a record with true for author fields and not include password', () => {
      const fields = AppUtilities.removePasswordForAuthorSelect();
      expect(fields).toHaveProperty('id', true);
      expect(fields).toHaveProperty('email', true);
      expect(fields).toHaveProperty('displayName', true);
      expect(fields).not.toHaveProperty('password');
    });
  });

  describe('hasher & validator', () => {
    it('should hash a password and validate correctly', async () => {
      const password = 'mySecretPassword123';
      const hash = await AppUtilities.hasher(password);
      expect(hash).toBeDefined();
      expect(hash).not.toEqual(password);

      const isValid = await AppUtilities.validator(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await AppUtilities.validator('wrongPassword', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('encode & decode', () => {
    it('should encode string to base64 and decode back', () => {
      const original = 'Hello Chattr!';
      const encoded = AppUtilities.encode(original);
      const decoded = AppUtilities.decode(encoded);
      expect(decoded).toBe(original);
    });
  });
});
