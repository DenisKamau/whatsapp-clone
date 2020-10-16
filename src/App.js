import React, { useEffect, useState } from "react";
import "./App.css";
import Sidebar from "../src/components/Sidebar/Sidebar";
import Chat from "../src/components/Chat/Chat";
import Pusher from "pusher-js";
import axios from "./axios";

const App = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get("/messages/sync").then((resp) => {
      setMessages(resp.data);
    });
  }, []);

  useEffect(() => {
    const pusher = new Pusher("0ae61556ae042a38f6cd", {
      cluster: "mt1",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]); //when this app,loads run this piece of code once

  return (
    <div className="app">
      <div className="app__body">
        <Sidebar />
        <Chat messages={messages} />
      </div>
    </div>
  );
};

export default App;
