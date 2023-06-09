require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
// const harperSaveMessage = require("./services/harper-save-message");
// const harperGetMessages = require("./services/harper-get-messages");
const leaveRoom = require("./utils/leave-room"); // Add this
const { CLIENT_RENEG_WINDOW } = require("tls");

app.use(cors()); // Add cors middleware

const server = http.createServer(app); // Add this

// Create an io server and allow for CORS from http://localhost:3000 with GET and POST methods
const io = new Server(server, {
    cors: {
        origin: ["http://192.168.59.30:3000", "http://192.168.59.180:3000","http://192.168.59.60:3000", "http://192.168.56.1:3000","http://localhost:3000"],
        methods: ["GET", "POST"],
    },
});

const CHAT_BOT = "ChatBot";
let chatRoom = ""; // E.g. javascript, node,...
let allUsers = []; // All users in current chat room

// Listen for when the client connects via socket.io-client
io.on("connection", (socket) => {
    console.log(`User connected ${socket.id}`);

    // Add a user to a room
    socket.on("join_room", (data) => {
        const { username, room } = data; // Data sent from client when join_room event emitted
        socket.join(room); // Join the user to a socket room
        let __createdtime__ = Date.now(); // Current timestamp
        // Send message to all users currently in the room, apart from the user that just joined
        socket.to(room).emit("receive_message", {
            message: `${username} has joined the chat room`,
            username: CHAT_BOT,
            __createdtime__,
        });
        console.log("Dupa x joined chat");
        // Send welcome msg to user that just joined chat only
        socket.emit("receive_message", {
            message: `Welcome ${username}`,
            username: CHAT_BOT,
            __createdtime__,
        });
        console.log("Dupa x welcome");
        // Save the new user to the room
        chatRoom = room;
        allUsers.push({ id: socket.id, username, room });
        chatRoomUsers = allUsers.filter((user) => user.room === room);
        console.log(allUsers);
        console.log(chatRoomUsers);
        socket.to(room).emit("chatroom_users", chatRoomUsers);
        socket.emit("chatroom_users", chatRoomUsers);

        // Get last 100 messages sent in the chat room
        // harperGetMessages(room)
        //   .then((last100Messages) => {
        //     // console.log('latest messages', last100Messages);
        //     socket.emit('last_100_messages', last100Messages);
        //   })
        //   .catch((err) => console.log(err));
    });

    socket.on("send_message", (data) => {
        const { message, username, room, __createdtime__ } = data;
        console.log(message);
        io.in(room).emit("receive_message", data);
    //    socket.broadcast.emit("receive_message", data);
        console.log(io.in(room)); // Send to all users in room, including sender
        // harperSaveMessage(message, username, room, __createdtime__) // Save message in db
        //     .then((response) => console.log(response))
        //     .catch((err) => console.log(err));
    });

    socket.on("send_game_move", (data) => {
        const { game, username, room } = data;
    //    io.in(room).emit("receive_game_move", data);
       socket.broadcast.emit("receive_game_move", data);
        console.log(data);
    });    
    socket.on("send_computer_move", (data) => {
        const { game, username, room, level } = data;
        const jsChessEngine = require('js-chess-engine')
        const rec_game = new jsChessEngine.Game(game)
        rec_game.printToConsole()
        console.log(rec_game.exportFEN());
        let move;
        switch (level) {
            case "beginner":
                move = rec_game.aiMove(0);
                break;
            case "intermediate":
                move = rec_game.aiMove(1);
                break;
            case "professional":
                move = rec_game.aiMove(2);
                break;
            case "grandmaster":
                move = rec_game.aiMove(3);
                break;
            default:
                break;
        }
        rec_game.printToConsole()
        data.game = rec_game.exportFEN();
        data.move = move;
        console.log(move);
        //localStorage.setItem(JSON.stringify(username), JSON.stringify(data.game));
        console.log(rec_game.exportFEN());
       io.in(room).emit("receive_computer_move", data);
       // socket.broadcast.emit("receive_game_move", data);
        console.log(data);
    });

    socket.on("leave_room", (data) => {
        const { username, room } = data;
        socket.leave(room);
        const __createdtime__ = Date.now();
        // Remove user from memory
        allUsers = leaveRoom(socket.id, allUsers);
        socket.to(room).emit("chatroom_users", allUsers);
        socket.to(room).emit("receive_message", {
            username: CHAT_BOT,
            message: `${username} has left the chat`,
            __createdtime__,
        });
        console.log(`${username} has left the chat`);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected from the chat");
        const user = allUsers.find((user) => user.id == socket.id);
        if (user?.username) {
            allUsers = leaveRoom(socket.id, allUsers);
            socket.to(chatRoom).emit("chatroom_users", allUsers);
            socket.to(chatRoom).emit("receive_message", {
                message: `${user.username} has disconnected from the chat.`,
            });
        }
    });
});

server.listen(4000, () => "Server is running on port 4000");
