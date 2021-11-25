const app = require("express")();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 5000;

const { emit } = require("process");
const { addUser, removeUser, getUser, getUsers } = require("./users");

io.on("connection", (socket) => {
  socket.on("join", (username) => {
    // add users
    const { error, user } = addUser({ id: socket.id, username });

    // join room
    socket.join("chat");

    socket.emit("message", {
      user: "admin",
      text: `${user.username} welcome bro, GLHF :)`,
    });

    socket.broadcast.to("chat").emit('message', {
      user: "admin",
      text: `${user.username} has joined the chat`,
    });

    io.to("chat").emit("roomData", { users: getUsers });
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);
    io.to("chat").emit("message", { user: user.username, text: message });

    callback();
  });

  socket.on("disconnect", () => {
    const user = removeUser(socket.id);
    console.log("[disconect]", user);
    if (user) {
      io.to("chat").emit("message", {
        user: "Admin",
        text: `${user.name} has left.`,
      });

      io.to("chat").emit("roomData", {
        users: getUsers,
      });
    }
  });
});

server.listen(PORT, () =>
  console.log(`server running on http://localhost:${PORT}`)
);
