import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import "./SidebarChat.css";
import db from './firebase'
import { Link } from "react-router-dom";
import { useStateValue } from './StateProvider'
import { actionTypes } from "./reducer";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import firebase from "firebase"
function SidebarChat(props) {
    const [seed, setSeed] = useState("");
    const {addNewChatVal,name,id}=props;
    const [messages,setMessages]=useState([]);
    const [{togglerState}, dispatch]= useStateValue();

    //  console.log(!addNewChatVal)

    useEffect(()=>{
        // db.collection('rooms').doc(id).collection('messages').orderBy
        // ('timestamp','desc').onSnapshot(snapshot =>(
        //     setMessages(snapshot.docs.map((doc) => doc.data()))
        // ))
        // id!==undefined?'ab':''
        if(id){
        db.collection('rooms').doc(id).collection('messages').orderBy
        ('timestamp','desc').onSnapshot(snapshot =>(
            setMessages(snapshot.docs.map((doc) => doc.data()))
        ))
       
        }
      //  console.log(id)
    },[])


    // console.log(messages,id);
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, []);

    const createChat = () => { 
        const roomName=prompt("Please enter name for chat")
        if(roomName){
          db.collection("rooms").add({
              name:roomName,
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
        }
    };
   // console.log(id);

   const handleChat =()=>{
    dispatch({
        type:actionTypes.SET_TOGGLER,
        togglerState:togglerState+1
    })

   }



    return (addNewChatVal!=="true") ? (
        <Link to={`/rooms/${id}`} onClick={handleChat}>
            <div className="sidebarChat">
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
            <div className="sidebarChat__info">
                <h2 className="room__name">{name}</h2>
                <p className="sidebar__lastmessages__color"><span className="sidebar__lastMessageName">{ (id !="" && messages.length>0)?(messages[0]?.name+ ": "):"Loading: "}</span>{ (id !="" && messages.length>0)?(messages[0]?.message):"Start a new chat"}</p>
            </div>
        </div>
        </Link>

    ) : (
            <div onClick={createChat} className="sidebarChat addnew__chat">
                <h2>Add New Room</h2><AddCircleIcon/>
            </div>
        );
}

export default SidebarChat;
