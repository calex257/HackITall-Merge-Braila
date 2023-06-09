import styles from './styles.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerChessboard from '../chess/PlayerChessboard';
import { Chess } from "chess.js";
import SingleChessboard from '../single/single';

const RoomAndUsers = ({ socket, username, room, count, setCount, type, level, boardFEN, setBoardFEN, setMoves, moves }) => {
  const [roomUsers, setRoomUsers] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    socket.on('chatroom_users', (data) => {
      console.log(data);
      setRoomUsers(data);
      let nr = 0;
      for(let i = 0;i<data.length;i ++) {
        if(data[i].username === username) {
          nr = i;
          break;
        }
      }
      setCount(nr);
    });

    return () => socket.off('chatroom_users');
  }, [socket]);

  const leaveRoom = () => {
    const __createdtime__ = Date.now();
    socket.emit('leave_room', { username, room, __createdtime__ });
    // Redirect to home page
    navigate('/', { replace: true });
  };

  return (
    <div className={styles.roomAndUsersColumn}>
      {
        type===0?
        <PlayerChessboard socket={socket} username={username} room={room} count={count} setBoardFEN={setBoardFEN}
        setMoves={setMoves} moves={moves}>
      </PlayerChessboard>:
      <SingleChessboard socket={socket} username={username} room={room} count={count} level={level}
      setBoardFEN={setBoardFEN} setMoves={setMoves}>

      </SingleChessboard>
        }
        <div>
        <div className={styles.fenstring}>
                    {boardFEN}
                </div>
        <div className={styles.hcontainer}>
      <h2 className={styles.roomTitle}>{`ROOM CODE: ${room}`}</h2>
      <div className={styles.userContainer}>
        {roomUsers.length > 0 && <h5 className={styles.usersTitle}>Users:</h5>}
        <ul className={styles.usersList} example>
          {roomUsers.map((user) => (
            <li
            style={{
              fontWeight: `${user.username === username ? 'bold' : 'normal'}`,
            }}
            key={user.id}
            >
              {user.username}
            </li>
          ))}
        </ul>
      </div>

     {/* <button className='btn btn-outline' onClick={leaveRoom}>
        Leave
      </button> */}
        </div>

      

      {/* <button className='btn btn-outline' onClick={leaveRoom}>
        Leave
      </button> */}
      </div>
    </div>
  );
  
};

export default RoomAndUsers;
