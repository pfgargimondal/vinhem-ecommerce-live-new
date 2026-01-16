import { useState } from "react";
import "./Css/ChatProfileDetails.css";
import http from "../../../http";

export const ChatProfileDetails = ({ setChatProfileDetailsShow }) => {

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      name: "VF",
      text: "Welcome to VinHem Fashion! How can I help you?",
    },
  ]);

  const [input, setInput] = useState("");

  // Send user message
  const handleSend = async () => {
    if (!input.trim()) return;

    const newUserMsg = {
      sender: "user",
      name: "Me",
      text: input,
    };

    setMessages(prev => [...prev, newUserMsg]);

    const userMessage = input;
    setInput("");

    // ---- API CALL TO BACKEND OR CHATGPT ----
    try {
      const response = await http.post(
        "/chat",
        { message: userMessage } // ✅ data goes here
      );

      const data = response.data; // ✅ Axios auto parses JSON

      const botReply = {
        sender: "bot",
        name: "VF",
        text: data.reply,
      };

      setMessages(prev => [...prev, botReply]);

    } catch (error) {
      // console.log("Chat error:", error);

      setMessages(prev => [
        ...prev,
        {
          sender: "bot",
          name: "VF",
          text: "Sorry, something went wrong!",
        },
      ]);
    }
  };

  return (
    <div className="chat-profile-details-wrapper position-fixed">
      <i
        onClick={() => setChatProfileDetailsShow(false)}
        className="bi bi-x position-absolute"
      ></i>

      <div className="coisdejnkfrhewir">
        <div className="dcsdfnhrtdfsv p-3">
          <img src="/images/logo.png" className="bg-white p-2 rounded-2 mb-2" alt="" />
          <h6 className="mb-1 text-white">VinHem Fashion CRM Support</h6>
          <p className="mb-0 text-white">Typically replies within 7 minutes</p>
        </div>

        <div className="domwejewrwer bg-white px-3 py-2">
          <div className="doiewnjrwerwer bg-white px-2 py-3">

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`doewkmjrewr d-flex align-items-center mb-4 ${
                  msg.sender === "user" ? "flex-row-reverse user-msge" : "admn-msge"
                }`}
              >
                <div className="imjdeqr text-center text-white rounded-pill mx-1">
                  <p className="mb-0">{msg.name}</p>
                </div>

                <div className="doejwrkmwer">
                  <div
                    className={`dowerwerr p-3 ${
                      msg.sender === "user"
                        ? "rounded-end-1 rounded-bottom-4 rounded-start-4"
                        : "rounded-end-4 rounded-bottom-4 rounded-top-1"
                    }`}
                  >
                    <h6 className="mb-0">{msg.text}</h6>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

        <div className="depjorierer position-relative">
          <textarea
            className="form-control rounded-0"
            placeholder="Reply here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            name="message"
          ></textarea>

          <div className="doiewjrmwerwer position-absolute d-flex align-items-center top-50 end-0 translate-middle-y">
            <i className="bi p-2 h-100 bi-paperclip"></i>
            <i className="bi p-2 h-100 bi-emoji-smile"></i>
          </div>
        </div>
      </div>
    </div>
  );
};
