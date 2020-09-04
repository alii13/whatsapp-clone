import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import "./SidebarChat.css";
import db from './firebase'
import { Link } from "react-router-dom";
function SidebarChat(props) {
    const [seed, setSeed] = useState("");
    const {addNewChatVal,name,id}=props;
    const [messages,setMessages]=useState([]);
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
          })
        }
    };
   // console.log(id);



    return (addNewChatVal!=="true") ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
            <div className="sidebarChat__info">
                <h2>{name}</h2>
                <p><span className="sidebar__lastMessageName">{ (id !="" && messages.length>0)?(messages[0]?.name+ ": "):"Loading"}</span>{ (id !="" && messages.length>0)?(messages[0]?.message):"Loading"}</p>
            </div>
        </div>
        </Link>

    ) : (
            <div onClick={createChat} className="sidebarChat">
                <h2>Add new Chat</h2>
            </div>
        );
}

export default SidebarChat;
