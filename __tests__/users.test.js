const { Users } = require('./../server/utils/users');

describe('Users', () => {
  var users;

  beforeEach(() => {
    users = new Users();

    users.users = [{
      id: '1',
      name: 'mike', 
      room: 'node course'
    }, {
      id: '2',
      name: 'jen', 
      room: 'react course'
    }, {
      id: '3',
      name: 'julie', 
      room: 'node course'
    }];
  });

  it('should add a new user', () => {
    var users = new Users();
    var newUser = {
      id: '123abc12',
      name: 'tester',
      room: 'test'
    };

    var res = users.addUser(newUser.id, newUser.name, newUser.room);

    expect(res).toEqual(newUser);
    expect(users.users).toContainEqual(newUser);
  });

  it('should returns names of users in room `node course`', () => {
    var nameList = users.getUserList('node course');

    expect(nameList).toEqual(['mike', 'julie']);
  });

  it('should returns names of users in room `react course`', () => {
    var nameList = users.getUserList('react course');

    expect(nameList).toEqual(['jen']);
  });

  it('should find a user with valid id', () => {
    var userToFind = users.users[1];
    var userFound = users.getUser(userToFind.id);

    expect(userFound).toEqual(userToFind);
  });

  it('should not find a user with invalid user', () => {
    var user = users.getUser('123');

    expect(user).toBeUndefined();
  });

  it('should remove a user', () => {
    var userToRemove = users.users[2];
    var removedUser = users.removeUser(userToRemove.id);

    expect(removedUser).toEqual(userToRemove);
    expect(users.users.length).toBe(2);
  });

  it('should not remove a user', () => {
    var removedUser = users.removeUser('123');

    expect(removedUser).toBeUndefined();
    expect(users.users.length).toBe(3);
  });
});