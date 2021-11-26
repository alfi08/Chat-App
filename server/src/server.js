const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;

const { emit } = require("process");
const { addUser, removeUser, getUser, getUsersInRoom } = require("./users");

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    // add users
    const { error, user } = addUser({ id: socket.id, username, room });

    if (error) {
      return callback(error);
    }

    console.log("[join]", user);
    // join room
    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `welcome, ${user.username}`,
    });

    socket.broadcast.to(user.room).emit("message", {
      user: "admin",
      text: `${user.username} has joined the chat`,
    });
    io.to(user.room).emit("roomData", { users: getUsersInRoom(user.room) });
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit("message", { user: user.username, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);

    console.log("[disconect]", user);

    if (user) {
      io.to(user.room).emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });

      io.to(user.room).emit("roomData", {
        users: getUsersInRoom(user.room),
      });
    }
  });
});

server.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
