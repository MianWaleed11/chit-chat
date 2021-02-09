import React, { useState, useEffect } from "react";
import { Link, NavLink, useHistory } from "react-router-dom";
import { Jumbotron, Spinner, ListGroup, ListGroupItem } from "reactstrap";
import Moment from "moment";
import firebase from "../../Firebase";
import "./RoomList.css";
import {
  Button,
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Theme,
  Tooltip,
} from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      width: 250,
    },
    demo: {
      backgroundColor: "#2979ff",
      textAlign: "center",
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
  })
);

const RoomList: React.FC = () => {
  const [room, setRoom] = useState([]);
  const [showLoading, setShowLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const history = useHistory();
  const classes = useStyles();
  const snapshotToArray = (snapshot: any) => {
    const returnArr: any = [];

    snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
  };
  useEffect(() => {
    //@ts-ignore
    let name: string = localStorage.getItem("nickname");
    const fetchData = async () => {
      setNickname(name);
      firebase
        .database()
        .ref("rooms/")
        .on("value", (resp) => {
          setRoom([]);
          setRoom(snapshotToArray(resp));
          setShowLoading(false);
        });
    };

    fetchData();
  }, []);

  const enterChatRoom = (roomname: any) => {
    const chat = {
      roomname: "",
      nickname: "",
      message: "",
      date: "",
      type: "",
    };
    chat.roomname = roomname;
    chat.nickname = nickname;
    chat.date = Moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
    chat.message = `${nickname} enter the room`;
    chat.type = "join";
    const newMessage = firebase.database().ref("chats/").push();
    newMessage.set(chat);

    firebase
      .database()
      .ref("roomusers/")
      .orderByChild("roomname")
      .equalTo(roomname)
      .on("value", (resp) => {
        let roomuser = [];
        roomuser = snapshotToArray(resp);
        const user = roomuser.find((x: any) => x.nickname === nickname);
        if (user !== undefined) {
          const userRef = firebase.database().ref("roomusers/" + user.key);
          userRef.update({ status: "online" });
        } else {
          const newroomuser = { roomname: "", nickname: "", status: "" };
          newroomuser.roomname = roomname;
          newroomuser.nickname = nickname;
          newroomuser.status = "online";
          const newRoomUser = firebase.database().ref("roomusers/").push();
          newRoomUser.set(newroomuser);
        }
      });

    history.push("/chatroom/" + roomname);
  };

  const logout = () => {
    localStorage.removeItem("nickname");
    history.push("/");
  };
  return (
    <div>
      {showLoading && <CircularProgress />}
      <h3>
      {"NickName: "} {nickname}
       
      </h3>
      <Button
          variant="outlined"
          color="secondary"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </Button>
      <h2>Room List</h2>
      <div>
      <Button variant="outlined" color="primary" onClick={()=> history.push("/addroom")}>
        Add Room
      </Button>
        {/* <NavLink to="/addroom">Add Room</NavLink> */}
      </div>
      <div className="rt-center">
        <List>
          {room.map((item: any, index: any) => (
            <Tooltip key={index} title="Join ChatRoom" aria-label="add">
              <ListItem
                
                onClick={() => {
                  enterChatRoom(item.roomname);
                }}
              >
                <ListItemText primary={item.roomname} />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </div>
      {/* <ListGroup>
        {room.map((item: any, idx: any) => (
          <ListGroupItem
            key={idx}
            action
            onClick={() => {
              enterChatRoom(item.roomname);
            }}
          >
            {item.roomname}
          </ListGroupItem>
        ))}
      </ListGroup> */}
    </div>
  );
};

export default RoomList;
