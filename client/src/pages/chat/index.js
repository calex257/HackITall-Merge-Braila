import styles from "./styles.module.css";
import RoomAndUsersColumn from "./room-and-users";
import SendMessage from "./send-message";
import MessagesReceived from "./messages";
import { useParams } from "react-router-dom";
import {useState} from 'react';

const Chat = ({ username, room, count, setCount, socket, type, level }) => {
    const { id } = useParams();
    const [roomUsers, setRoomUsers] = useState([]);
    const [boardFEN, setBoardFEN] = useState("");
    const [moves, setMoves] = useState([]); 
    console.log(id);
    return (
        <div className={styles.chatContainer}>
            <div className={styles.leftcol}>
                <div className={styles.movelist}>
                    {moves.map(
                        (move) => {
                            if(move){

                                return <div className={styles.move}>
                                {`${move.from} ${move.to}`}
                            </div>
                            }
                            return <></>;
                        }
                    )}
                </div>
            </div>
            <RoomAndUsersColumn
                socket={socket}
                username={username}
                room={room}
                count={count}
                setCount={setCount}
                type={type}
                level={level}
                boardFEN={boardFEN}
                setBoardFEN={setBoardFEN}
                setMoves={setMoves}
                moves={moves}
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
