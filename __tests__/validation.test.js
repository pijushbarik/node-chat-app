const { isRealString } = require('./../server/utils/validation');

describe('isRealString', () => {
  it('should return true for valid string', () => {
    var result = isRealString('  test text    ');

    expect(result).toBeTruthy();
  });

  it('should return false for non-string', () => {
    var result = isRealString(123);

    expect(result).toBeFalsy();
  });

  it('should return false for only spaced string', () => {
    var result = isRealString('   ');

    expect(result).toBeFalsy();
  });
});