import styles from "./styles.module.css";
import RoomAndUsersColumn from "./room-and-users";
import SendMessage from "./send-message";
import MessagesReceived from "./messages";
import { Chessboard } from "react-chessboard";
import PlayerChessboard from "../chess/PlayerChessboard";

const Chat = ({ username, room, socket }) => {
    return (
        <div className={styles.chatContainer}>
            <PlayerChessboard
                id="BasicBoard"
                socket={socket}
                username={username}
                room={room}
            ></PlayerChessboard>
            <RoomAndUsersColumn
                socket={socket}
                username={username}
                room={room}
            />
            <div>
                <MessagesReceived socket={socket} />
                <SendMessage socket={socket} username={username} room={room} />
            </div>
        </div>
    );
};

export default Chat;
