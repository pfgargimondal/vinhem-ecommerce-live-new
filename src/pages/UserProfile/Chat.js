import { Link } from "react-router-dom";
import { UserProfileNavMenu } from "../../components";
import styles from "./Css/Chat.module.css";
import { useEffect, useState } from "react";
import http from "../../http";

export const Chat = () => {
    const [selectedSupport, setSelectedSupport] = useState(null);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [chatAdmins, setChatAdmins] = useState([]);
    const [chatSupportAvatarBaseURL, setChatSupportAvatarBaseURL] = useState(null);
      // eslint-disable-next-line
    const [loadingMessages, setLoadingMessages] = useState(false);

    // console.log(messages)


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
        if (!input.trim() || !selectedSupport) return;

        const newMessage = {
            text: input,
            sender: "me",
            created_at: new Date().toISOString(),
        };

        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setInput("");

        try {
            await http.post("/user/post-chat-message", {
                reciver_id: selectedSupport.id,
                message: input,
            });
        } catch (error) {
            console.error("Error sending message:", error);
            setMessages((prevMessages) =>
                prevMessages.map((msg) =>
                    msg === newMessage ? { ...msg, error: true } : msg
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
                                                    return (
                                                        <div
                                                        key={index}
                                                        className={`mb-2 d-flex ${isUser ? "justify-content-end" : "justify-content-start"}`}
                                                        >
                                                        <div
                                                            className={`p-2 rounded ${
                                                            isUser ? `${styles.bg_pink} text-white` : "bg-secondary text-white"
                                                            }`}
                                                        >
                                                            {msg.message || msg.text}
                                                        </div>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>

                                        {/* Input */}
                                        <div className={`${styles.cdrgbghjjfgrfvrt} d-flex border-top p-2`}>
                                            <input
                                                type="text"
                                                className="form-control me-2"
                                                placeholder="Type a reply..."
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                disabled={!selectedSupport}
                                            />
                                            <button
                                                className="btn btn-main"
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