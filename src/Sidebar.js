import React,{useState,useEffect} from "react";
import { Avatar, IconButton } from "@material-ui/core";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchOutlined from "@material-ui/icons/SearchOutlined";
import SidebarChat from "./SidebarChat"
import "./Sidebar.css";
import db from "./firebase"
function Sidebar() {
        const [rooms,setRooms] = useState([]);
        useEffect(()=>{
          //  console.log(db)
            const unsubscribe = db.collection('rooms').onSnapshot(snapshot=>{
                setRooms(snapshot.docs.map(doc=>(
                    {
                        id:doc.id,
                        data:doc.data()
                    }
                ))
                )
            });
            return ()=>{
                unsubscribe();
            }
        },[])

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <Avatar />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                <SearchOutlined/>
                <input placeholder="Search or Start a new chat" type="text"/>
                </div>
            </div>
            <div className="sidebar__chats">
                <SidebarChat addNewChatVal="true" />
                {rooms.map(room=>(
                    <SidebarChat key={room.id} id={room.id}
                    name={room.data.name} />
                ))}
            </div>
        </div>
    );
}

export default Sidebar;
