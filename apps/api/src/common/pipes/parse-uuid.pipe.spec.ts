import { ParseUUIDPipe } from './parse-uuid.pipe';
import { BadRequestException } from '@nestjs/common';

describe('ParseUUIDPipe', () => {
  const pipe = new ParseUUIDPipe();

  it('should accept valid UUIDs', () => {
    const uuid = '550e8400-e29b-41d4-a716-446655440000';
    expect(pipe.transform(uuid)).toBe(uuid);
  });

  it('should reject invalid strings', () => {
    expect(() => pipe.transform('not-a-uuid')).toThrow(BadRequestException);
    expect(() => pipe.transform('')).toThrow(BadRequestException);
    expect(() => pipe.transform('123')).toThrow(BadRequestException);
  });
});
