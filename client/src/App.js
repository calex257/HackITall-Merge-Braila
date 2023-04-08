import "./App.css";
import { useState } from "react";
import Home from "./pages/home";
import Chat from "./pages/chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io.connect("http://192.168.59.60:4000");

function App() {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");

    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                username={username}
                                setUsername={setUsername}
                                room={room}
                                setRoom={setRoom}
                                socket={socket}
                            />
                        }
                    />
                    {/* Add this */}
                    <Route
                        path="/chat"
                        element={
                            <Chat
                                username={username}
                                room={room}
                                socket={socket}
                            />
                        }
                    />
                    <Route
                        path="/game/:id"
                        element={
                            <Chat
                                username={username}
                                room={room}
                                socket={socket}
                            />
                        }
                    ></Route>
                    <Route path="/single" element={<Chat></Chat>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
