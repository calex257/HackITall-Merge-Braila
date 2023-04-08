import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom"; // Add this

const Home = ({ username, setUsername, room, setRoom, socket }) => {
    const navigate = useNavigate(); // Add this

    const joinRoom = () => {
        if (room !== "" && username !== "") {
            room = Math.floor(Math.random() * 10000);
            socket.emit("join_room", { username, room });
        }

        // Redirect to /chat
        navigate(`/game/${room}`, { replace: true });
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

                <select
                    className={styles.input}
                    onChange={(e) => setRoom(e.target.value)}
                >
                    <option>-- Select your level --</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="professional">Professional</option>
                    <option value="grandmaster">Grandmaster</option>
                </select>

                <button
                    className="btn btn-secondary"
                    style={{ width: "100%" }}
                    onClick={joinRoom}
                >
                    Join Room
                </button>
            </div>
        </div>
    );
};

export default Home;
