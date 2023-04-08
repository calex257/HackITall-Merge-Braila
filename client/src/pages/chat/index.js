import styles from "./styles.module.css";
import RoomAndUsersColumn from "./room-and-users";
import SendMessage from "./send-message";
import MessagesReceived from "./messages";
import { useParams } from "react-router-dom";

const Chat = ({ username, room, socket }) => {
    const { id } = useParams();
    console.log(id);
    return (
        <div className={styles.chatContainer}>
            <RoomAndUsersColumn
                socket={socket}
                username={username}
                room={room}
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
