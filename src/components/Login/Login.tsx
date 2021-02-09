import { Button, TextField } from "@material-ui/core";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { FormGroup } from "@material-ui/core";
import "./Login.css";
import firebase from "../../Firebase";
import { Spinner, Form } from "reactstrap";
import CircularProgress from "@material-ui/core/CircularProgress";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
      },
    },
  })
);
const useStyleTextField = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& > *": {
        margin: theme.spacing(1),
        width: "25ch",
      },
    },
  })
);

const Login: React.FC = () => {
  const history = useHistory();
  const [creds, setCreds] = useState({ nickname: "" });
  const [showLoading, setShowLoading] = useState(false);
  const ref = firebase.database().ref("users/");
  const classes = useStyles();
  const classText = useStyleTextField();

  const onChange = (e: any) => {
    e.persist();
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };
  const login = (e: any) => {
    e.preventDefault();
    setShowLoading(true);
    ref
      .orderByChild("nickname")
      .equalTo(creds.nickname)
      .once("value", (snapshot) => {
        if (snapshot.exists()) {
          localStorage.setItem("nickname", creds.nickname);
          history.push("/roomlist");
          setShowLoading(false);
        } else {
          const newUser = firebase.database().ref("users/").push();
          newUser.set(creds);
          localStorage.setItem("nickname", creds.nickname);
          history.push("/roomlist");
          setShowLoading(false);
        }
      });
  };
  return (
    <div className="rt-form-containor">
      {showLoading && <CircularProgress />}
      <Form onSubmit={login}>
        <legend>Enter UserName to join ChatRooms</legend>
        <FormGroup>
          <div className={classes.root}>
            <TextField
              label="ChatName"
              variant="outlined"
              type="text"
              name="nickname"
              id="nickname"
              placeholder="Enter Your Chatname"
              value={creds.nickname}
              onChange={onChange}
            />
          </div>
        </FormGroup>
        <div className={classes.root}>
          <Button variant="contained" color="primary" type='submit'>
            Login
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
