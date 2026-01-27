import { Link } from "react-router-dom";
import { UserProfileNavMenu } from "../../components";
import styles from "./Css/Chat.module.css";
import { useEffect, useRef, useState } from "react";
import http, { BASE_URL } from "../../http";
import EmojiPicker from 'emoji-picker-react';

export const Chat = () => {
    const [selectedSupport, setSelectedSupport] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatAdmins, setChatAdmins] = useState([]);
    const [chatSupportAvatarBaseURL, setChatSupportAvatarBaseURL] = useState(null);
      // eslint-disable-next-line
    const [loadingMessages, setLoadingMessages] = useState(false);
   

    const [message, setMessage] = useState("");
    const [showEmoji, setShowEmoji] = useState(false);

    const emojiRef = useRef(null);
    const emojiBtnRef = useRef(null);

    // ✅ Close emoji picker on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (
            emojiRef.current &&
            !emojiRef.current.contains(event.target) &&
            !emojiBtnRef.current.contains(event.target)
        ) {
            setShowEmoji(false);
        }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleEmojiClick = (emojiData) => {
        setMessage((prev) => prev + emojiData.emoji);
    };


    useEffect(() => {
        const fetchAdmins = async () => {
            try {
                const getresponse = await http.get("/fetch-all-admin");
                const chatWithAdmins = getresponse.data.data;

                setChatSupportAvatarBaseURL(getresponse.data.image_url);
                setChatAdmins(chatWithAdmins);
            } catch (error) {
                console.error("Error fetching admins:", error);
            }
        };
        fetchAdmins();
    }, []);


    useEffect(() => {
        if (!selectedSupport) return;

        const fetchMessages = async () => {
            try {
                const response = await http.post("/user/fetch-chat-message", {
                    reciver_id: selectedSupport.id,
                });
                setMessages(response.data.data || []);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        // Fetch immediately
        fetchMessages();

        // Auto refresh every 5 seconds
        const interval = setInterval(fetchMessages, 5000);

        return () => clearInterval(interval);
    }, [selectedSupport]);


    const sendMessage = async () => {
        if (!message.trim() || !selectedSupport) return;

        const messageText = message.trim();

        const newMessage = {
            id: Date.now(),
            text: messageText,
            sender: "me",
            created_at: new Date().toISOString(),
            status: "sending",
        };

        // Optimistic UI update
        setMessages((prev) => [...prev, newMessage]);
        setMessage("");

        try {
            await http.post("/user/post-chat-message", {
            reciver_id: selectedSupport.id,
            message: messageText,
            });

            setMessages((prev) =>
            prev.map((msg) =>
                msg.id === newMessage.id
                ? { ...msg, status: "sent" }
                : msg
            )
            );
        } catch (error) {
            console.error("Error sending message:", error);

            setMessages((prev) =>
            prev.map((msg) =>
                msg.id === newMessage.id
                ? { ...msg, status: "error" }
                : msg
            )
            );
        }
    };


    // ✅ Auto scroll chat box
    useEffect(() => {
        const chatBox = document.querySelector(`.${styles.ldknwejknlkkekrrr}`);
        if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
    }, [messages]);

    return (
        <div className={styles.ffhfdf}>
            <div className="ansjidnkuiweer">
                <div className={styles.fbghdfg}>
                    <div className="row">
                        <div className="col-lg-3">
                            <UserProfileNavMenu />
                        </div>

                        <div className="col-lg-9">
                            <div className={styles.fgcbdfgdf}>
                                <div className={`${styles.alojdkmlkoljeirr} row border border-start-0 border-bottom-0 rounded shadow-sm`} style={{ height: "90vh" }}>
                                    
                                    {/* Left Users Panel */}
                                    <div className="col-lg-3 border-end p-0">
                                        <div className="p-3 border-bottom fw-bold">Support</div>
                                        
                                        <div className={styles.diewnrnwekhriwejrwejr}>
                                            {chatAdmins.map((chatAdmin) => (
                                                <div 
                                                    key={chatAdmin.id}
                                                    className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom user-item"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={() => {
                                                        setSelectedSupport(chatAdmin);
                                                        setMessages([]);
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center">
                                                        <img
                                                            src={`${chatSupportAvatarBaseURL}/${chatAdmin.profile_picture}`}
                                                            alt={chatAdmin.name}
                                                            className="rounded-circle me-2"
                                                            width="40"
                                                            height="40"
                                                        />
                                                        <div>
                                                            <div className="fw-semibold">{chatAdmin.name}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}    
                                        </div>                                        
                                    </div>

                                    {/* Right Chat Panel */}
                                    <div className="col-lg-9 d-flex flex-column">
                                        <div className="border-bottom d-flex align-items-center justify-content-between p-3 fw-semibold">
                                            {selectedSupport ? `Chat with ${selectedSupport.name}` : "Please select a support option to start chatting"}

                                            <div className="d-flex align-items-center justify-content-end">
                                                <p className={`${styles.ndiwhermweoewrr} mb-0 me-3 d-none`}>
                                                    <Link to="/">
                                                        <i className="fa-solid me-1 fa-arrow-left" /> 
                                                        Back To Home 
                                                        <i className="fa-solid ms-1 fa-house" />
                                                    </Link>
                                                </p>
                                            </div>
                                        </div>

                                        {/* Messages */}
                                        <div className={`${styles.ldknwejknlkkekrrr} flex-grow-1 p-3 bg-light`}>
                                            {loadingMessages ? (
                                                <div className="text-muted text-center mt-5">Loading messages...</div>
                                                ) : messages.length === 0 ? (
                                                <div className="text-muted text-center mt-5">
                                                    {selectedSupport ? "Start chatting..." : "Select a support person from the user panel"}
                                                </div>
                                                ) : (
                                                messages.map((msg, index) => {
                                                const isUser = msg.user_type === "User" || msg.sender === "me";
                                                const align = isUser ? "justify-content-end" : "justify-content-start";
                                                const color = isUser ? `${styles.bg_pink} text-white` :
                                                                msg.sender === "bot" ? "bg-success text-white" :
                                                                "bg-secondary text-white";

                                                // Build an array of nodes
                                                const messageContent = [];

                                                if (msg.message || msg.text) {
                                                    messageContent.push(<div key="text">{msg.message || msg.text}</div>);
                                                }

                                                if (msg.attachment && msg.attachment_type) {
                                                    const fileUrl = `${BASE_URL}/public/all_images/chat_attachments/${msg.attachment}`;

                                                    if (msg.attachment_type.startsWith("image/")) {
                                                    messageContent.push(
                                                        <img
                                                        key="img"
                                                        alt=""
                                                        src={fileUrl}
                                                        className="img-fluid rounded mt-1"
                                                        style={{ maxWidth: "200px" }}
                                                        />
                                                    );
                                                    } else if (msg.attachment_type.startsWith("video/")) {
                                                    messageContent.push(
                                                        <video
                                                        key="video"
                                                        controls
                                                        className="mt-1"
                                                        style={{ maxWidth: "220px" }}
                                                        >
                                                        <source src={fileUrl} type={msg.attachment_type} />
                                                        </video>
                                                    );
                                                    } else {
                                                    messageContent.push(
                                                        <a
                                                        key="file"
                                                        href={fileUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="d-inline-flex align-items-center gap-1 mt-1 fw-semibold chat-download"
                                                        style={{ color: isUser ? "#fff" : "#000" }}
                                                        >
                                                        <i className="bx bx-paperclip"></i> Download file
                                                        </a>
                                                    );
                                                    }
                                                }

                                                return (
                                                    <div key={index} className={`mb-2 d-flex ${align}`}>
                                                    <div className={`p-2 rounded ${color}`} style={{ maxWidth: "70%" }}>
                                                        {messageContent}
                                                    </div>
                                                    {/* <div className="small text-muted mt-1 ms-2">{msg.created_at}</div> */}
                                                    </div>
                                                );
                                                })
                                            )}
                                        </div>

                                        {/* Input */}
                                        <div className={styles.cdrgbghjjfgrfvrt}>
                                            <div className={styles.inputBox}>
                                                <input
                                                type="text"
                                                placeholder="Type a message"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                disabled={!selectedSupport}
                                                />
                                                 <span className={styles.divider}></span>
                                                <div className={styles.icons}>
                                                <i class="bi bi-paperclip"></i>

                                                <i
                                                    ref={emojiBtnRef}
                                                    className="bi bi-emoji-smile"
                                                    onClick={() => setShowEmoji((prev) => !prev)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                                </div>
                                            </div>

                                            {showEmoji && (
                                                <div ref={emojiRef} className={styles.emojiBox}>
                                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                                                </div>
                                            )}

                                            <button
                                                className="btn btn-main ms-2"
                                                onClick={sendMessage}
                                                disabled={!selectedSupport}
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};