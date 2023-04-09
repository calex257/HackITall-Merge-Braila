import "./App.css";
import { useState } from "react";
import Home from "./pages/home";
import Chat from "./pages/chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import io from "socket.io-client";
import { useParams } from "react-router-dom";

const socket = io.connect("http://localhost:4000");

function App() {
    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [count, setCount] = useState(-1);
    const [level, setLevel] = useState('beginner');

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
                                count={count}
                                setCount={setCount}
                                socket={socket}
                                level={level}
                                setLevel={setLevel}
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
                                count={count}
                                setCount={setCount}
                                socket={socket}
                                type={0}
                            />
                        }
                    />
                    <Route
                        path="/game/:id"
                        element={
                            <Chat
                                username={username}
                                room={room}
                                count={count}
                                setCount={setCount}
                                socket={socket}
                                type={0}
                            />
                        }
                    ></Route>
                    <Route path="/single/:id" element={<Chat
                                                    username={username}
                                                    room={room}
                                                    count={count}
                                                    setCount={setCount}
                                                    socket={socket}
                                                    type={1}
                                                    level={level}
                                                    >

                    </Chat>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
