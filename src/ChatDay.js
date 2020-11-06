import React from "react";

function ChatDay(props) {
  return (
    <div className="chat__body__daystamp">
      <p className="chat__body__daystamp__title">{props.date}</p>
    </div>
  );
}

export default ChatDay;
