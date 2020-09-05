import React, { useEffect, useState,useRef} from 'react'
import { Avatar, IconButton } from "@material-ui/core";
import AttachFile from "@material-ui/icons/AttachFile";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import MicIcon from "@material-ui/icons/Mic";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import db from "./firebase"
import firebase from "firebase"
import "./Chat.css"
import { useParams } from 'react-router-dom';
import { useStateValue } from './StateProvider'
import { actionTypes } from "./reducer";
import UseWindowDimensions from "./UseWindowDimensions";
import useSound from 'use-sound';
// import recievesoundURL from "./recieve.mp3"
// import DrawerPhone from "./DrawerPhone";
function Chat() {

    const [seed, setSeed] = useState("");
    const [input, setInput] = useState("");
    const {roomId}=useParams();
    const [roomName,setRoomName]=useState("false");
    const [messages,setMessages]=useState([]);
    const [toggler, setToggler]=useState(true)
    const displayName =localStorage.getItem('displayName');
    const [{togglerState}, dispatch]= useStateValue();
    const [issendChecked, setIssendChecked]=useState(false);
    // const [isRecChecked, setIsRecChecked]=useState(1);
     const { width } = UseWindowDimensions();

    //console.log(roomId);

    const [playOn] = useSound(
        `${process.env.PUBLIC_URL}/send.mp3`,
        { volume: 0.5 }
      );
      const [playOff] = useSound(
        `${process.env.PUBLIC_URL}/send.mp3`,
        { volume: 0.5 }
      );

    //   const [playOnRec] = useSound(
    //     sendsoundURL,
    //     { volume: 0.5 }
    //   );
    //   const [playOffRec] = useSound(
    //     sendsoundURL,
    //     { volume: 0.5 }
    //   );
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

 // console.log(togglerState);
 
    
    const sendMessage=(e)=>{
        e.preventDefault();
        // console.log("You Typedd >>>>",input);
        db.collection('rooms').doc(roomId).collection('messages').add({
            message:input,
            name:displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        setIssendChecked(!issendChecked);
        issendChecked ? playOff() : playOn();
        setInput("");
    };
    const messagesEndRef = useRef(null);
    const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" })

  }
  useEffect(()=>{
    setToggler(!toggler);
  },[togglerState])

  useEffect(scrollToBottom, [messages]);
  const handleDrawerToggle =() =>{
      setToggler(!toggler);
      dispatch({
        type:actionTypes.SET_TOGGLER,
        togglerState:togglerState+1
    })
  };
    return (
    <>{
        width<629?(
            <div className={togglerState%2===0?"chat":"chat hide__chat"}>
                <div className="chat__header">
                <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <ArrowBackIcon />
              </IconButton>
                    <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                    <div className="chat__headerInfo">
                        <h3>{roomName}</h3>
                        <p className="header__lastSeen">last seen {messages.length!==0?(messages[messages.length-1].timestamp?.toDate().toUTCString()):"Loading"}</p>
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
                    <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                    <div className="chat__headerInfo">
                        <h3>{roomName}</h3>
                        <p className="header__lastSeen">last seen {messages.length!==0?(messages[messages.length-1].timestamp?.toDate().toUTCString()):"Loading"}</p>
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
                        <p className={`chat__messages ${(message.name===displayName) && 'chat__reciever'}`}>
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

                <div className="chat__footer__absolute">
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
        ):
        (
            <div className={"chat"}>
                <div className="chat__header">
                    <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                    <div className="chat__headerInfo">
                        <h3>{roomName}</h3>
                        <p className="header__lastSeen">last seen {messages.length!==0?(String(messages[messages.length-1].timestamp?.toDate().toUTCString()).slice(0,22) ):"Loading"}</p>
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
                        <p className={`chat__messages ${(message.name===displayName) && 'chat__reciever'}`}>
                        <span className="chat__name">{message.name }</span>{message.message}
                        <span className="chat__timestamp">
                         {String(new Date(message.timestamp?.toDate()).toUTCString()).slice(5,12) + String(new Date(message.timestamp?.toDate()).toUTCString()).slice(17,22)}  </span></p>
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
        )}

    </>
    ) 
}

export default Chat
