import React from 'react'
import "./SidebarChat.css"
import { Avatar } from "@material-ui/core";
function sidebarUsernames({usernames}) {
    return (
        <>
            {usernames.map((username, index) =>(
                <div className="username__row">
            <div className="sidebarChat__wrapper" style={{width: "100%"}}>
            <Avatar src={username?.photoURL} />
            <div className="sidebarChat__info">
                <h2 className="room__name">{username?.name}</h2>
            </div>
            </div>

                </div>
            ))}
        </>
    )
}

export default sidebarUsernames
