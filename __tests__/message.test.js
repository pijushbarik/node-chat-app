var { generateMessage, generateLocationMessage } = require('./../server/utils/message');

describe('generateMessage', () => {
  it('should generate correct message object', () => {
    var from = 'tester';
    var text = 'a test message from test';

    var message = generateMessage(from, text);

    expect(message.from).toBe(from);
    expect(message.text).toBe(text);
    expect(message.createdAt).toBeTruthy();
    expect(typeof message.createdAt).toBe('number');
  });
});

describe('generateLocationMessage', () => {
  it('should return correct message object with location url', () => {
    var from = 'tester';

    var latitude = 20.211;
    var longitude = 56.1412;

    var message = generateLocationMessage(from, {
      latitude,
      longitude
    });

    expect(message.from).toBe(from);
    expect(message.url).toBeTruthy();
    expect(message.url).toBe(`https://www.google.com/maps/?q=${latitude},${longitude}`);
    expect(message.createdAt).toBeTruthy();
    expect(typeof message.createdAt).toBe('number');
  });
});