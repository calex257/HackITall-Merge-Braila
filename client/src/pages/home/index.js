import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom"; // Add this
import { useState } from "react";

const Home = ({ username, setUsername, room, setRoom, count, setCount, socket, level, setLevel }) => {
    const navigate = useNavigate(); // Add this
    const [roomID, setRoomID] = useState("");

    const handleChange = (event) => {
        setRoomID(event.target.value.toLowerCase());
    };
    const createRoom = () => {
       const rm =(Math.random() + 1).toString(36).substring(7);
        console.log(rm);
        if (username !== "") {
            setRoom(rm);
            setCount(0);
            console.log(count);
            socket.emit("join_room", { username, room: rm });
        }

        // Redirect to /chat
        navigate(`/game/${rm}`, { replace: true });
    };
    const createSingle = () => {
       const rm =(Math.random() + 1).toString(36).substring(7);
        console.log(rm);
        if (username !== "") {
            setRoom(rm);
            setCount(0);
            console.log(count);
            socket.emit("join_room", { username, room: rm });
        }

        // Redirect to /chat
        navigate(`/single/${rm}`, { replace: true });
    };
    const joinRoom = (value) => {
        socket.emit("join_room", { username, room: roomID.toLowerCase() });
        setRoom(roomID.toLowerCase());
        setCount((state)=>state + 1);
        console.log(count);
        console.log(roomID);
        navigate(`/game/${roomID}`, { replace: true });
    };
    const spectateRoom = (value) => {
        socket.emit("join_room", { username, room: roomID });
        setRoom(roomID);
        setCount((state)=>state + 1);
        console.log(count);
        console.log(roomID);
        navigate(`/single/${roomID}`, { replace: true });
    };

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <h1>{`Welcome`}</h1>
                <input
                    className={styles.input}
                    placeholder="Username..."
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="text"
                    onChange={handleChange}
                    value={roomID}
                ></input>
                <button
                    className="btn btn-secondary"
                    style={{ width: "100%" }}
                    onClick={(e) => joinRoom(e.target.value.toLowerCase())}
                >
                    Join game
                </button>
                <select className={styles.input} onChange={(e) => {setLevel(e.target.value)}}>
                    <option>-- Select your level --</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="professional">Professional</option>
                    <option value="grandmaster">Grandmaster</option>
                </select>

                <button
                    className="btn btn-secondary"
                    style={{ width: "100%" }}
                    onClick={createRoom}
                >
                    Make Room
                </button>
                <button
                    className="btn btn-secondary"
                    style={{ width: "100%" }}
                    onClick={createSingle}
                >
                    Single player game
                </button>
                <button
                    className="btn btn-secondary"
                    style={{ width: "100%" }}
                    onClick={spectateRoom}
                >
                    Spectate computer game
                </button>
            </div>
        </div>
    );
};

export default Home;