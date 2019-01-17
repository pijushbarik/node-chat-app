var { generateMessage } = require('./message');

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