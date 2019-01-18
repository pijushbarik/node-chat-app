class Users {
  constructor () {
    this.users = [];
  }

  addUser (id, name, room) {
    var user = { id, name, room };
    this.users.push(user);

    return user;
  }

  removeUser (id) {
    var removedUser = this.users.filter(user => user.id === id);
    var updatedUsers = this.users.filter(user => user.id !== id);
    this.users = [...updatedUsers];

    return removedUser[0];
  }

  getUser (id) {
    var userToFind = this.users.filter(user => user.id === id);

    return userToFind[0];
  }

  getUserList (room) {
    var usersInRoom = this.users.filter(user => user.room === room);
    var namesOfUsersInRoom = usersInRoom.map(user => user.name);

    return namesOfUsersInRoom;
  }
}

module.exports = { Users };