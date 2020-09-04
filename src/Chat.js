import React, { useEffect, useState,useRef} from 'react'
import { Avatar, IconButton } from "@material-ui/core";
import AttachFile from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import db from "./firebase"
import firebase from "firebase"
import "./Chat.css"
import { useParams } from 'react-router-dom';
function Chat() {

    const [seed, setSeed] = useState("");
    const [input, setInput] = useState("");
    const {roomId}=useParams();
    const [roomName,setRoomName]=useState("false");
    const [messages,setMessages]=useState([]);
    const displayName =localStorage.getItem('displayName');

    //console.log(roomId);
    useEffect(()=>{
      setSeed(Math.floor(Math.random() * 5000));
        if(roomId){
            db.collection('rooms').doc(roomId).onSnapshot(snapshot=>{
                setRoomName(snapshot.data().name)
            })

            db.collection('rooms').doc(roomId).collection("messages").orderBy('timestamp','asc').onSnapshot(snapshot => {
                setMessages(snapshot.docs.map(doc =>doc.data()));
            })
        }

    },[roomId])

  
    
    const sendMessage=(e)=>{
        e.preventDefault();
        // console.log("You Typedd >>>>",input);
        db.collection('rooms').doc(roomId).collection('messages').add({
            message:input,
            name:displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setInput("");
    };
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })

  }

  useEffect(scrollToBottom, [messages]);

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p className="header__lastSeen">last seen {messages.length!=0?(messages[messages.length-1].timestamp?.toDate().toUTCString()):"Loading"}</p>
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
                {messages.map((message) => (
                    <p className={`chat__messages ${(message.name==displayName) && 'chat__reciever'}`}>
                    <span className="chat__name">{message.name}</span>{message.message}
                    <span className="chat__timestamp">
                     {new Date(message.timestamp?.toDate()).toUTCString()}  </span></p>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat__footer">
                <IconButton>
                <InsertEmoticonIcon/>
                </IconButton>
                <form>
                    <input value={input} type="text" placeholder="Type a message" onChange={e=>setInput(e.target.value)}/>
                    <button type="submit" onClick={sendMessage} >Send A message</button>
                </form>
                <IconButton>
               <MicIcon/>
                </IconButton>

            </div>

        </div>
    )
}

export default Chat
