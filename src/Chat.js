import React, { useEffect, useState, useRef } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import AttachFile from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import db from "./firebase";
import firebase from "firebase";
import "./Chat.css";
import { Link, useParams } from "react-router-dom";
import { useStateValue } from "./StateProvider";
import { actionTypes } from "./reducer";
import UseWindowDimensions from "./UseWindowDimensions";
import useSound from "use-sound";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import Linkify from "react-linkify";

function Chat() {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("false");
  const [messages, setMessages] = useState([]);
  const [toggler, setToggler] = useState(true);
  const displayName = localStorage.getItem("displayName");
  const [{ togglerState }, dispatch] = useStateValue();
  const [{ photoURL }] = useStateValue();
  const [emoji, setEmoji] = useState(false);
  const [issendChecked, setIssendChecked] = useState(false);
  const [datewise, setDateWise] = useState([]);
  const [clientGMT, setClinetGMT] = useState("");
  const [lastseenPhoto, setLastseen] = useState("");
  const { width } = UseWindowDimensions();
  var hour = 0,
    extramin = 0,
    minutes = 0,
    hourly = 0,
    GMTminutes = String(clientGMT).slice(4, 6),
    scrl,
    fix = 0;

  const [playOn] = useSound(`${process.env.PUBLIC_URL}/send.mp3`, {
    volume: 0.5,
  });
  const [playOff] = useSound(`${process.env.PUBLIC_URL}/send.mp3`, {
    volume: 0.5,
  });

  const addEmoji = (e) => {
    let emoji = e.native;
    setInput(input + emoji);
  };
  const checkEmojiClose = () => {
    if (emoji) {
      setEmoji(false);
    }
  };

  function getTimeZone() {
    var offset = new Date().getTimezoneOffset(),
      o = Math.abs(offset);
    return (
      (offset < 0 ? "+" : "-") +
      ("00" + Math.floor(o / 60)).slice(-2) +
      ":" +
      ("00" + (o % 60)).slice(-2)
    );
  }
  useEffect(() => {
    setClinetGMT(getTimeZone());
  });
  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
    if (roomId) {
      db.collection("rooms")
        .doc(roomId)
        .onSnapshot((snapshot) => {
          setRoomName(snapshot.data().name);
        });

      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .orderBy("timestamp", "asc")
        .onSnapshot((snapshot) => {
          setMessages(snapshot.docs.map((doc) => doc.data()));
        });
    }
  }, [roomId]);
  useEffect(() => {
    setLastseen(messages[messages.length - 1]?.photoURL);
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (input.length > 0) {
      db.collection("rooms")
        .doc(roomId)
        .collection("messages")
        .add({
          message: input,
          name: displayName,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          photoURL: localStorage.getItem("photoURL"),
        });
      setIssendChecked(!issendChecked);
      issendChecked ? playOff() : playOn();
      setInput("");
    }
  };

  let blankObj = {};
  let TotalObj = [];
  if (messages.length > 0) {
    let checkDate = "";
    let blankArray = [];
    let dateArray = [];
    messages.forEach(function (message, i) {
      let messageDate = String(
        new Date(message.timestamp?.toDate()).toUTCString()
      ).slice(5, 12);
      if (dateArray.indexOf(messageDate) === -1) {
        dateArray.push(messageDate);
      }
    });
    var index = 0;
    messages.forEach(function (message, i) {
      let messageDate = String(
        new Date(message.timestamp?.toDate()).toUTCString()
      ).slice(5, 12);
      if (messageDate === dateArray[index] && i == messages.length - 1) {
        blankArray.push({
          messageData: message.message,
          name: message.name,
          timestamp: message.timestamp,
        });
        blankObj[dateArray[index]] = blankArray;
        TotalObj.push(blankObj);
        blankObj = {};
        blankArray = [];
        blankArray.push({
          messageData: message.message,
          name: message.name,
          timestamp: message.timestamp,
        });
        index = index + 1;
      } else if (messageDate == dateArray[index]) {
        blankArray.push({
          messageData: message.message,
          name: message.name,
          timestamp: message.timestamp,
        });
      } else {
        blankObj[dateArray[index]] = blankArray;
        TotalObj.push(blankObj);
        blankObj = {};
        blankArray = [];
        blankArray.push({
          messageData: message.message,
          name: message.name,
          timestamp: message.timestamp,
        });
        if (messageDate != dateArray[index] && i == messages.length - 1) {
          blankObj[messageDate] = blankArray;
          TotalObj.push(blankObj);
        }
        index = index + 1;
      }
    });
  }
  useEffect(() => {
    setDateWise(TotalObj);
  }, [messages]);

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  useEffect(() => {
    scrollToBottom();
  });

  useEffect(() => {
    setToggler(!toggler);
  }, [togglerState]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleDrawerToggle = () => {
    setToggler(!toggler);
    dispatch({
      type: actionTypes.SET_TOGGLER,
      togglerState: togglerState + 1,
    });
  };
  return (
    <>
      {width < 629 ? (
        <div className={togglerState % 2 === 0 ? "chat" : "chat hide__chat"}>
          <div className="chat__header">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar src={lastseenPhoto} />
            <div className="chat__headerInfo">
              <h3>{roomName}</h3>
              <p className="header__lastSeen">
                last seen{" "}
                {messages.length !== 0
                  ? messages[messages.length - 1].timestamp
                      ?.toDate()
                      .toUTCString()
                  : "Loading"}
              </p>
            </div>
            <div className="chat__headerRight">
              <IconButton>
                <SearchOutlined />
              </IconButton>
              <IconButton>
                <AttachFile />
              </IconButton>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
          <div className="chat__header__absolute">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
            >
              <ArrowBackIcon />
            </IconButton>
            <Avatar src={lastseenPhoto} />
            <div className="chat__headerInfo">
              <h3>{roomName}</h3>
              <p className="header__lastSeen">
                last seen{" "}
                {messages.length !== 0
                  ? String(
                      messages[messages.length - 1].timestamp
                        ?.toDate()
                        .toUTCString()
                    ).slice(0, 22)
                  : "Loading"}
              </p>
            </div>
            <div className="chat__headerRight">
              <IconButton>
                <SearchOutlined />
              </IconButton>
              <IconButton>
                <AttachFile />
              </IconButton>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
          <div className="chat__body">
            {datewise.length > 0
              ? datewise.map((item, i) =>
                  item[Object.keys(item)].map((e, i) =>
                    i == 0 ? (
                      <>
                        {parseInt(String(Object.keys(item)).slice(0, 2)) ? (
                          <div className="chat__body__daystamp">
                            <p className="chat__body__daystamp__title">
                              {parseInt(
                                String(Object.keys(item)).slice(0, 2)
                              ) == parseInt(String(new Date().getDate()))
                                ? "TODAY"
                                : Object.keys(item)}
                            </p>
                          </div>
                        ) : null}
                        <p
                          className={`chat__messages ${
                            e.name === displayName && "chat__reciever"
                          }`}
                        >
                          <span className="chat__name">
                            {e.name.substr(0, e.name.indexOf(" "))}
                          </span>
                          <Linkify>{e.messageData}</Linkify>
                          <span className="chat__timestamp">
                            <div className="hidden">
                              {
                                (extramin =
                                  parseInt(
                                    String(
                                      new Date(
                                        e.timestamp?.toDate()
                                      ).toUTCString()
                                    ).slice(20, 22)
                                  ) +
                                    parseInt(GMTminutes) >
                                  60
                                    ? (parseInt(
                                        String(
                                          new Date(
                                            e.timestamp?.toDate()
                                          ).toUTCString()
                                        ).slice(20, 22)
                                      ) +
                                        parseInt(GMTminutes)) %
                                      60
                                    : 0)
                              }

                              {
                                (minutes =
                                  parseInt(
                                    String(
                                      new Date(
                                        e.timestamp?.toDate()
                                      ).toUTCString()
                                    ).slice(20, 22)
                                  ) +
                                    parseInt(GMTminutes) +
                                    extramin -
                                    fix >
                                  60
                                    ? (parseInt(
                                        String(
                                          new Date(
                                            e.timestamp?.toDate()
                                          ).toUTCString()
                                        ).slice(20, 22)
                                      ) +
                                        parseInt(GMTminutes) +
                                        extramin -
                                        fix) %
                                      60
                                    : parseInt(
                                        String(
                                          new Date(
                                            e.timestamp?.toDate()
                                          ).toUTCString()
                                        ).slice(20, 22)
                                      ) +
                                      parseInt(GMTminutes) +
                                      extramin -
                                      fix)
                              }
                              {(hour = extramin > 0 ? 1 : 0)}

                              {
                                (hourly =
                                  parseInt(
                                    String(
                                      new Date(
                                        e.timestamp?.toDate()
                                      ).toUTCString()
                                    ).slice(17, 19)
                                  ) +
                                    hour +
                                    parseInt(clientGMT) >
                                  24
                                    ? (parseInt(
                                        String(
                                          new Date(
                                            e.timestamp?.toDate()
                                          ).toUTCString()
                                        ).slice(17, 19)
                                      ) +
                                        hour +
                                        parseInt(clientGMT)) %
                                      24
                                    : parseInt(
                                        String(
                                          new Date(
                                            e.timestamp?.toDate()
                                          ).toUTCString()
                                        ).slice(17, 19)
                                      ) +
                                      hour +
                                      parseInt(clientGMT))
                              }
                            </div>
                            {hourly ? hourly % 12 : "00"}
                            {" : "}
                            {minutes !== 0
                              ? minutes < 10
                                ? "0" + minutes
                                : minutes
                              : "00"}
                            {hourly > 12 ? " PM" : " AM"}
                          </span>
                        </p>
                      </>
                    ) : (
                      <p
                        className={`chat__messages ${
                          e.name === displayName && "chat__reciever"
                        }`}
                      >
                        <span className="chat__name">
                          {e.name.substr(0, e.name.indexOf(" "))}
                        </span>
                        <Linkify>{e.messageData}</Linkify>
                        <span className="chat__timestamp">
                          <div className="hidden">
                            {
                              (extramin =
                                parseInt(
                                  String(
                                    new Date(
                                      e.timestamp?.toDate()
                                    ).toUTCString()
                                  ).slice(20, 22)
                                ) +
                                  parseInt(GMTminutes) >
                                60
                                  ? (parseInt(
                                      String(
                                        new Date(
                                          e.timestamp?.toDate()
                                        ).toUTCString()
                                      ).slice(20, 22)
                                    ) +
                                      parseInt(GMTminutes)) %
                                    60
                                  : 0)
                            }

                            {
                              (minutes =
                                parseInt(
                                  String(
                                    new Date(
                                      e.timestamp?.toDate()
                                    ).toUTCString()
                                  ).slice(20, 22)
                                ) +
                                  parseInt(GMTminutes) +
                                  extramin -
                                  fix >
                                60
                                  ? (parseInt(
                                      String(
                                        new Date(
                                          e.timestamp?.toDate()
                                        ).toUTCString()
                                      ).slice(20, 22)
                                    ) +
                                      parseInt(GMTminutes) +
                                      extramin -
                                      fix) %
                                    60
                                  : parseInt(
                                      String(
                                        new Date(
                                          e.timestamp?.toDate()
                                        ).toUTCString()
                                      ).slice(20, 22)
                                    ) +
                                    parseInt(GMTminutes) +
                                    extramin -
                                    fix)
                            }
                            {(hour = extramin > 0 ? 1 : 0)}

                            {
                              (hourly =
                                parseInt(
                                  String(
                                    new Date(
                                      e.timestamp?.toDate()
                                    ).toUTCString()
                                  ).slice(17, 19)
                                ) +
                                  hour +
                                  parseInt(clientGMT) >
                                24
                                  ? (parseInt(
                                      String(
                                        new Date(
                                          e.timestamp?.toDate()
                                        ).toUTCString()
                                      ).slice(17, 19)
                                    ) +
                                      hour +
                                      parseInt(clientGMT)) %
                                    24
                                  : parseInt(
                                      String(
                                        new Date(
                                          e.timestamp?.toDate()
                                        ).toUTCString()
                                      ).slice(17, 19)
                                    ) +
                                    hour +
                                    parseInt(clientGMT))
                            }
                          </div>
                          {hourly ? hourly % 12 : "00"}
                          {" : "}
                          {minutes !== 0
                            ? minutes < 10
                              ? "0" + minutes
                              : minutes
                            : "00"}
                          {hourly > 12 ? " PM" : " AM"}
                        </span>
                      </p>
                    )
                  )
                )
              : null}
            <div ref={messagesEndRef}></div>
          </div>

          <div className="chat__footer">
            <IconButton>
              <InsertEmoticonIcon
                className="yellow"
                onClick={() => setEmoji(!emoji)}
              />
              {emoji ? <Picker onSelect={addEmoji} /> : null}
            </IconButton>

            <form>
              <input
                value={input}
                type="text"
                placeholder="Type a message"
                onChange={(e) => setInput(e.target.value)}
                onClick={checkEmojiClose}
                disabled={
                  roomName === "Admin: Ali"
                    ? (displayName == "Shekh Aliul WqnNsFNEPr" ? true : false)
                      ? false
                      : true
                    : false
                }
              />
              <button type="submit" onClick={sendMessage}>
                Send A message
              </button>
            </form>
            <IconButton>
              <MicIcon />
            </IconButton>
          </div>

          <div className="chat__footer__absolute">
            <IconButton>
              <InsertEmoticonIcon />
            </IconButton>
            <form>
              <input
                value={input}
                type="text"
                placeholder="Type a message"
                onChange={(e) => setInput(e.target.value)}
                disabled={roomName == "Admin: Ali" ? true : false}
              />
              <button type="submit" onClick={sendMessage}>
                Send A message
              </button>
            </form>
            <IconButton>
              <MicIcon />
            </IconButton>
          </div>
        </div>
      ) : (
        <div className={"chat"}>
          <div className="chat__header">
            <Avatar src={lastseenPhoto} />
            <div className="chat__headerInfo">
              <h3>{roomName}</h3>
              <p className="header__lastSeen">
                last seen{" "}
                {messages.length !== 0
                  ? String(
                      messages[messages.length - 1].timestamp
                        ?.toDate()
                        .toUTCString()
                    ).slice(0, 22)
                  : "Loading"}
              </p>
            </div>
            <div className="chat__headerRight">
              <IconButton>
                <SearchOutlined />
              </IconButton>
              <IconButton>
                <AttachFile />
              </IconButton>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </div>
          </div>
          <div
            className="chat__body scrollbar-juicy-peach"
            onClick={checkEmojiClose}
          >
            {datewise.length > 0
              ? datewise.map(
                  (item, i) =>
                    item[Object.keys(item)].map((e, i) =>
                      i == 0 ? (
                        <>
                          {Object.keys(item) &&
                          Object.keys(item) != undefined ? (
                            <div className="chat__body__daystamp">
                              <p className="chat__body__daystamp__title">
                                {parseInt(
                                  String(Object.keys(item)).slice(0, 2)
                                ) == parseInt(String(new Date().getDate()))
                                  ? "TODAY"
                                  : Object.keys(item)}
                              </p>
                            </div>
                          ) : (
                            ""
                          )}
                          <p
                            className={`chat__messages ${
                              e.name === displayName && "chat__reciever"
                            }`}
                          >
                            <span className="chat__name">
                              {e.name.substr(0, e.name.indexOf(" "))}
                            </span>
                            <Linkify
                              properties={{
                                target: "_blank",
                                style: { color: "red", fontWeight: "bold" },
                              }}
                            >
                              {e.messageData}
                            </Linkify>
                            <span className="chat__timestamp">
                              <div className="hidden">
                                {
                                  (extramin =
                                    parseInt(
                                      String(
                                        new Date(
                                          e.timestamp?.toDate()
                                        ).toUTCString()
                                      ).slice(20, 22)
                                    ) +
                                      parseInt(GMTminutes) >
                                    60
                                      ? (parseInt(
                                          String(
                                            new Date(
                                              e.timestamp?.toDate()
                                            ).toUTCString()
                                          ).slice(20, 22)
                                        ) +
                                          parseInt(GMTminutes)) %
                                        60
                                      : 0)
                                }

                                {
                                  (minutes =
                                    parseInt(
                                      String(
                                        new Date(
                                          e.timestamp?.toDate()
                                        ).toUTCString()
                                      ).slice(20, 22)
                                    ) +
                                      parseInt(GMTminutes) +
                                      extramin -
                                      fix >
                                    60
                                      ? (parseInt(
                                          String(
                                            new Date(
                                              e.timestamp?.toDate()
                                            ).toUTCString()
                                          ).slice(20, 22)
                                        ) +
                                          parseInt(GMTminutes) +
                                          extramin -
                                          fix) %
                                        60
                                      : parseInt(
                                          String(
                                            new Date(
                                              e.timestamp?.toDate()
                                            ).toUTCString()
                                          ).slice(20, 22)
                                        ) +
                                        parseInt(GMTminutes) +
                                        extramin -
                                        fix)
                                }
                                {(hour = extramin > 0 ? 1 : 0)}

                                {
                                  (hourly =
                                    parseInt(
                                      String(
                                        new Date(
                                          e.timestamp?.toDate()
                                        ).toUTCString()
                                      ).slice(17, 19)
                                    ) +
                                      hour +
                                      parseInt(clientGMT) >
                                    24
                                      ? (parseInt(
                                          String(
                                            new Date(
                                              e.timestamp?.toDate()
                                            ).toUTCString()
                                          ).slice(17, 19)
                                        ) +
                                          hour +
                                          parseInt(clientGMT)) %
                                        24
                                      : parseInt(
                                          String(
                                            new Date(
                                              e.timestamp?.toDate()
                                            ).toUTCString()
                                          ).slice(17, 19)
                                        ) +
                                        hour +
                                        parseInt(clientGMT))
                                }
                              </div>
                              {hourly ? hourly % 12 : "00"}
                              {" : "}
                              {minutes !== 0
                                ? minutes < 10
                                  ? "0" + minutes
                                  : minutes
                                : "00"}
                              {hourly > 12 ? " PM" : " AM"}
                            </span>
                          </p>
                        </>
                      ) : (
                        <p
                          className={`chat__messages ${
                            e.name === displayName && "chat__reciever"
                          }`}
                        >
                          <span className="chat__name">
                            {e.name.substr(0, e.name.indexOf(" "))}
                          </span>
                          <Linkify>{e.messageData}</Linkify>
                          <span className="chat__timestamp">
                            <div className="hidden">
                              {
                                (extramin =
                                  parseInt(
                                    String(
                                      new Date(
                                        e.timestamp?.toDate()
                                      ).toUTCString()
                                    ).slice(20, 22)
                                  ) +
                                    parseInt(GMTminutes) >
                                  60
                                    ? (parseInt(
                                        String(
                                          new Date(
                                            e.timestamp?.toDate()
                                          ).toUTCString()
                                        ).slice(20, 22)
                                      ) +
                                        parseInt(GMTminutes)) %
                                      60
                                    : 0)
                              }

                              {
                                (minutes =
                                  parseInt(
                                    String(
                                      new Date(
                                        e.timestamp?.toDate()
                                      ).toUTCString()
                                    ).slice(20, 22)
                                  ) +
                                    parseInt(GMTminutes) +
                                    extramin -
                                    fix >
                                  60
                                    ? (parseInt(
                                        String(
                                          new Date(
                                            e.timestamp?.toDate()
                                          ).toUTCString()
                                        ).slice(20, 22)
                                      ) +
                                        parseInt(GMTminutes) +
                                        extramin -
                                        fix) %
                                      60
                                    : parseInt(
                                        String(
                                          new Date(
                                            e.timestamp?.toDate()
                                          ).toUTCString()
                                        ).slice(20, 22)
                                      ) +
                                      parseInt(GMTminutes) +
                                      extramin -
                                      fix)
                              }
                              {(hour = extramin > 0 ? 1 : 0)}

                              {
                                (hourly =
                                  parseInt(
                                    String(
                                      new Date(
                                        e.timestamp?.toDate()
                                      ).toUTCString()
                                    ).slice(17, 19)
                                  ) +
                                    hour +
                                    parseInt(clientGMT) >
                                  24
                                    ? (parseInt(
                                        String(
                                          new Date(
                                            e.timestamp?.toDate()
                                          ).toUTCString()
                                        ).slice(17, 19)
                                      ) +
                                        hour +
                                        parseInt(clientGMT)) %
                                      24
                                    : parseInt(
                                        String(
                                          new Date(
                                            e.timestamp?.toDate()
                                          ).toUTCString()
                                        ).slice(17, 19)
                                      ) +
                                      hour +
                                      parseInt(clientGMT))
                              }
                            </div>
                            {hourly ? hourly % 12 : "00"}
                            {" : "}
                            {minutes !== 0
                              ? minutes < 10
                                ? "0" + minutes
                                : minutes
                              : "00"}
                            {hourly > 12 ? " PM" : " AM"}
                          </span>
                        </p>
                      )
                    )
                )
              : null}
            <div ref={messagesEndRef} id="chat__box"></div>
          </div>

          <div className="chat__footer">
            <IconButton>
              <InsertEmoticonIcon
                className="yellow"
                onClick={() => setEmoji(!emoji)}
              />
              {emoji ? <Picker onSelect={addEmoji} /> : null}
            </IconButton>
            <form>
              <input
                value={input}
                type="text"
                placeholder="Type a message"
                onChange={(e) => setInput(e.target.value)}
                onClick={checkEmojiClose}
                disabled={
                  roomName === "Admin: Ali"
                    ? (displayName == "Shekh Aliul WqnNsFNEPr" ? true : false)
                      ? false
                      : true
                    : false
                }
              />
              <button type="submit" onClick={sendMessage}>
                Send A message
              </button>
            </form>
            <IconButton>
              <MicIcon />
            </IconButton>
          </div>
        </div>
      )}
    </>
  );
}

export default Chat;
