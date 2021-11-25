const users = [];

const addUser = ({ id, username }) => {
  username = username.trim().toLowerCase();

  const existingUser = users.find((user) => user.username === username);

  if (!username) return { error: "Username  are required." };
  if (existingUser) return { error: "Username is taken." };

  const user = { id, username };

  users.push(user);

  return { user, users };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) return users.splice(index, 1)[0];
};

const getUser = (id) => users.find((user) => user.id === id);

const getUsers = users;

module.exports = { addUser, removeUser, getUser, getUsers };
