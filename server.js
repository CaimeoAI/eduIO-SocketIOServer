//! CORE IMPORTS
import express from "express"; // FRAMEWORK
import http from "http"; // CONNECTION REQUIREMENT FOR SOCKET IO
import { Server } from "socket.io";

//? MIDDLEWARE IMPORTS
import cors from "cors"; // TRANSMITTING HTTP HEADERS
import morgan from "morgan"; // ADDITIONAL TERMINAL DATA

//! MAIN CONFIGURATION

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://eduio-frontend.onrender.com",
    methods: ["GET", "POST"],
  },
});

//? MIDDLEWARE CONFIGURATION

app.use(express.json({ limit: "50mb", extended: true })); // Allows to send json objects for POST/PUT requests and limits file upload to 50mb
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Allows to send strings and Arrays for POST/PUT requests and limits file upload to 50mb

app.use(cors());
app.use(morgan("dev")); // Developer Information in Terminal showing each request to the server

//! SOCKET IO CONNECTION

io.on("connection", (socket) => {
  console.log("User connected on socket " + socket.id);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log("User with ID:" + socket.id + " joined room " + data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected from socket " + socket.id);
  });
});

server.listen(3001, () => {
  console.log("http server for SocketIO listening on port 3001");
});
