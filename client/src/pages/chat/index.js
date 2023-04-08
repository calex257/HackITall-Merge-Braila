import styles from "./styles.module.css";
import RoomAndUsersColumn from "./room-and-users";
import SendMessage from "./send-message";
import MessagesReceived from "./messages";
import { useParams } from "react-router-dom";

const Chat = ({ username, room, count, setCount, socket, type, level }) => {
    const { id } = useParams();
    console.log(id);
    return (
        <div className={styles.chatContainer}>
            <RoomAndUsersColumn
                socket={socket}
                username={username}
                room={room}
                count={count}
                setCount={setCount}
                type={type}
                level={level}
            />

            <div>
                <MessagesReceived
                    socket={socket}
                    username={username}
                    room={room}
                />
                <SendMessage socket={socket} username={username} room={room} />
            </div>
        </div>
    );
};

export default Chat;
