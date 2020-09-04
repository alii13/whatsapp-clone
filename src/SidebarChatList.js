import React from 'react'
import SidebarChat from "./SidebarChat"
import "./SidebarChatList.css"
function SidebarChatList(props) {
    const {rooms,dr}=props;
    //console.log(rooms,"hey");
    // const styles={
    //     mediaQ
    // }
    console.log(dr);
    return (
    <div class="sidebar__chatList">
        <div className="sidebar__chats">
        <SidebarChat addNewChatVal="true" />
        {rooms.map(room=>(
            <SidebarChat key={room.id} id={room.id}
            name={room.data.name} />
        ))}
        </div>
    </div>
    )
}

export default SidebarChatList
