import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";
import AddRoom from "../components/addRoom/AddRoom";
import ChatRoom from "../components/chatroom/ChatRoom";
import Login from "../components/Login/Login";
import RoomList from "../components/roomList/RoomList";

const Routes: React.FC = () => {
  // let location = useLocation();
  // console.log(location);
  return (
    <Router>
      {/* <Redirect
        to={{
          pathname: "/roomlist",
          state: { from: location },
        }}
      /> */}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/roomlist" component={RoomList} />
        <Route exact path="/addroom" component={AddRoom} />
        <Route exact path="/chatroom/:room" component={ChatRoom} />
      </Switch>
    </Router>
  );
};

export default Routes;
