import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Alert,
  Jumbotron,
  Spinner,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import firebase from "../../Firebase";

const AddRoom: React.FC = () => {
  const history = useHistory();
  const [room, setRoom] = useState({ roomname: "" });
  const [showLoading, setShowLoading] = useState(false);
  const ref = firebase.database().ref("rooms/");

  const save = (e: any) => {
    e.preventDefault();
    setShowLoading(true);
    ref
      .orderByChild("roomname")
      .equalTo(room.roomname)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          return (
            <div>
              <Alert color="primary">Room name already exist!</Alert>
            </div>
          );
        } else {
          const newRoom = firebase.database().ref("rooms/").push();
          newRoom.set(room);
          history.goBack();
          setShowLoading(false);
        }
      });
  };
  const onChange = (e: any) => {
    e.persist();
    setRoom({ ...room, [e.target.name]: e.target.value });
  };
  return (
    <div>
      {showLoading && <Spinner color="primary" />}
      <Jumbotron>
        <h2>Please enter new Room Name</h2>
        <Form onSubmit={save}>
          <FormGroup>
            <TextField
              type="text"
              name="roomname"
              id="standard-basic"
              label="Enter New Room Name"
              value={room.roomname}
              onChange={onChange}
            />
            {/* <Input
              type="text"
              name="roomname"
              id="roomname"
              placeholder="Enter New Room Name"
              value={room.roomname}
              onChange={onChange}
            /> */}
          </FormGroup>
          <Button
            type="submit"
            variant="outlined"
            color="primary"
            style={{ margin: "10px" }}
          >
            Add
          </Button>
        </Form>
      </Jumbotron>
    </div>
  );
};

export default AddRoom;
