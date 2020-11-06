import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import "./SidebarChat.css";
import db from "./firebase";
import { Link } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import firebase from "firebase";
import { password } from "./constants";
function SidebarChat(props) {
  const [seed, setSeed] = useState("");
  const { addNewChatVal, name, id } = props;
  const [messages, setMessages] = useState([]);
  const [{ togglerState }, dispatch] = useStateValue();

  useEffect(() => {
    if (id) {
      db.collection("rooms")
        .doc(id)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) =>
          setMessages(snapshot.docs.map((doc) => doc.data()))
        );
    }
  }, []);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);
  const deleteRoom = () => {
    const passwordVerify = prompt("Enter Admin Password to delete Room");
    if (passwordVerify == password) {
      db.collection("rooms")
        .doc(id)
        .delete()
        .then(function () {
          window.location = "/";
        })
        .catch(function (error) {
          console.error("Error removing document: ", error);
        });
    } else {
      alert("You are not authorised to delete rooms");
    }
  };

  const createChat = () => {
    const roomName = prompt("Please enter name for chat");
    if (roomName && roomName.length >= 20) {
      return alert("enter a shorter name for the room");
    }
    if (roomName) {
      db.collection("rooms").add({
        name: roomName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  };

  const handleChat = () => {
    dispatch({
      type: actionTypes.SET_TOGGLER,
      togglerState: togglerState + 1,
    });
  };

  return addNewChatVal !== "true" ? (
    <div className="sidebarChat">
      <Link to={`/rooms/${id}`} onClick={handleChat}>
        <div className="sidebarChat__wrapper">
          <Avatar src={messages[0]?.photoURL} />
          <div className="sidebarChat__info">
            <h2 className="room__name">{name}</h2>
            <p className="sidebar__lastmessages__color">
              <span className="sidebar__lastMessageName">
                {id != "" && messages.length > 0
                  ? messages[0]?.name + ": "
                  : "Loading: "}
              </span>
              {id != "" && messages.length > 0
                ? messages[0]?.message
                : "Start a new chat"}
            </p>
          </div>
        </div>
      </Link>
      <div className="sidebarChat__delete" onClick={deleteRoom}>
        <DeleteForeverIcon />
      </div>
    </div>
  ) : (
    <div onClick={createChat} className="sidebarChat addnew__chat">
      <h2>Add New Room</h2>
      <AddCircleIcon />
    </div>
  );
}

export default SidebarChat;
