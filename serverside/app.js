const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./model/user');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const chatRoute = require('./routes/chat');
const messageRoute = require('./routes/message');
const userRoute = require('./routes/user');

const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/livechat';

app.use(cors({
  origin: 'http://localhost:5173'
}));


mongoose.connect(dbUrl, {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database Connected');
});


app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


const secret = process.env.SECRET
const sessionConfig = {
  secret: secret,
  name: '_mgSoad',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
};

app.use(express.json());
app.use(session(sessionConfig));
app.use(express.static(path.join(__dirname, 'public')));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => {
  done(null, user._id); // Assuming the user object has an '_id' property
});

// Deserialize the user object
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

app.get('/', (req, res) => {
  res.json(200);
});

app.use('/', chatRoute);
app.use('/', messageRoute);
app.use('/', userRoute);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

io.on('connection', (socket) => {
  let room;

  socket.on('join-room', (data) => {
    room = data.room;
    socket.join(room);
  });

  socket.on('send-chat-message', (message) => {
    io.to(room).emit('chat-message', message);
  });
});

const io2 = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:5173",
    // credentials: true,
  },
});

io2.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (user) => {

    socket.join(user._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
