import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardSubtitle,
  Button,
  Form,
  InputGroup,
  Input,
  InputGroupAddon,
} from "reactstrap";
import Moment from "moment";
import firebase from "../../Firebase";
import ScrollToBottom from "react-scroll-to-bottom";
import "../../Styles.css";
import { IRoomName } from "../../interface/roomName.interface";

const ChatRoom: React.FC = () => {
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [nickname, setNickname] = useState("");
  const [roomname, setRoomname] = useState("");
  const [newchat, setNewchat] = useState({
    roomname: "",
    nickname: "",
    message: "",
    date: "",
    type: "",
  });
  const history = useHistory();
  const { room } = useParams<IRoomName>();

  useEffect(() => {
    //@ts-ignore
    let name: string = localStorage.getItem("nickname");
    const fetchData = async () => {
      setNickname(name);
      setRoomname(room);
      await firebase
        .database()
        .ref("chats/")
        .orderByChild("roomname")
        .equalTo(roomname)
        .on("value", (resp) => {
          setChats([]);
          setChats(snapshotToArray(resp));
        });
    };

    fetchData();
  }, [room, roomname]);
  useEffect(() => {
    //@ts-ignore
    let name: string = localStorage.getItem("nickname");

    const fetchData = async () => {
      setNickname(name);
      setRoomname(room);
      firebase
        .database()
        .ref("roomusers/")
        .orderByChild("roomname")
        .equalTo(roomname)
        .on("value", (resp2) => {
          setUsers([]);
          const roomusers = snapshotToArray(resp2);
          setUsers(roomusers.filter((x: any) => x.status === "online"));
        });
    };

    fetchData();
  }, [room, roomname]);

  const snapshotToArray = (snapshot: any) => {
    const returnArr: any = [];

    snapshot.forEach((childSnapshot: any) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
  };

  const submitMessage = (e: any) => {
    e.preventDefault();
    const chat = newchat;
    chat.roomname = roomname;
    chat.nickname = nickname;
    chat.date = Moment(new Date()).format("DD/MM/YYYY HH:mm:ss");
    chat.type = "message";
    const newMessage = firebase.database().ref("chats/").push();
    newMessage.set(chat);
    setNewchat({ roomname: "", nickname: "", message: "", date: "", type: "" });
  };
  const onChange = (e: any) => {
    e.persist();
    setNewchat({ ...newchat, [e.target.name]: e.target.value });
  };
  const exitChat = (e: any) => {
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
    chat.message = `${nickname} leave the room`;
    chat.type = "exit";
    const newMessage = firebase.database().ref("chats/").push();
    newMessage.set(chat);

    firebase
      .database()
      .ref("roomusers/")
      .orderByChild("roomname")
      .equalTo(roomname)
      .once("value", (resp) => {
        let roomuser = [];
        roomuser = snapshotToArray(resp);
        const user = roomuser.find((x: any) => x.nickname === nickname);
        if (user !== undefined) {
          const userRef = firebase.database().ref("roomusers/" + user.key);
          userRef.update({ status: "offline" });
        }
      });

    history.goBack();
  };
  console.log(firebase.database().ref("chats/"));
  
  return (
    <div className="Container">
      <Container>
        <Row>
          <Col xs="4">
            <div>
              <Card className="UsersCard">
                <CardBody>
                  <CardSubtitle>
                    <Button
                      variant="primary"
                      type="button"
                      onClick={(e: any) => exitChat(e)}
                    >
                      Exit Chat
                    </Button>
                  </CardSubtitle>
                </CardBody>
              </Card>
              {users.map((item: any, idx: any) => (
                <Card key={idx} className="UsersCard">
                  <CardBody>
                    <CardSubtitle>{item.nickname}</CardSubtitle>
                  </CardBody>
                </Card>
              ))}
            </div>
          </Col>
          <Col xs="8">
            <ScrollToBottom className="ChatContent">
            {chats.map((item: any, idx: any) => (
              <div key={idx} className="MessageBox">
                {item.type === "join" || item.type === "exit" ? (
                  <div className="ChatStatus">
                    <span className="ChatDate">{item.date}</span>
                    <span className="ChatContentCenter">{item.message}</span>
                  </div>
                ) : (
                  <div className="ChatMessage">
                    <div
                      className={`${
                        item.nickname === nickname
                          ? "RightBubble"
                          : "LeftBubble"
                      }`}
                    >
                      {item.nickname === nickname ? (
                        <span className="MsgName">Me</span>
                      ) : (
                        <span className="MsgName">{item.nickname}</span>
                      )}
                      <span className="MsgDate"> at {item.date}</span>
                      <p>{item.message}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
            </ScrollToBottom>
            <footer className="StickyFooter">
              <Form className="MessageForm" onSubmit={submitMessage}>
                <InputGroup>
                  <Input
                    type="text"
                    name="message"
                    id="message"
                    placeholder="Enter message here"
                    value={newchat.message}
                    onChange={onChange}
                  />
                  <InputGroupAddon addonType="append">
                    <Button variant="primary" type="submit">
                      Send
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              </Form>
            </footer>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ChatRoom;
