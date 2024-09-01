import React, { useContext, useEffect, useRef, useState } from 'react';
import Topbar from '../../components/topbar/topbar';
import './messenger.css';
import { Search } from '@material-ui/icons';
import {PermMedia, Cancel} from '@material-ui/icons';
import Message from '../../components/message/message';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { io } from 'socket.io-client';
import CloseFriend from '../../components/closefriends/closeFriend';
import { isImage } from '../../utils/imageType';

export default function Messenger() {
    // const { user } = useContext(AuthContext);
    const [user, setUser]=useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef();
    const socket = useRef();
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [friendList, setFriendsList] = useState([]);
    const chatBoxRef = useRef(null);
    const [file, setFile ]= useState(null);
    useEffect(() => {
        if(localStorage.getItem("user")){
          setUser(JSON.parse(localStorage.getItem("user")));
          console.log(user);
        }
      }, [localStorage.getItem("user")]);

    const initiateLoadChat = async()=>{
        const res = await axios.get(`/conversation/${user?._id}`); 
        let conversationId=null;
        res?.data?.map((el)=>{
            if(el.members.includes(selectedFriend?._id) && el.members.includes(user?._id)){
                conversationId=el?._id;
            }
        });
        console.log("initiate Chat",conversationId, res);
        
        if (!conversationId) {
            // Create a new conversationS  
            const newConversationRes = await axios.post(`/conversation`, {
                senderId: user?._id,
                receiverId: selectedFriend?._id
            });
            // console.log("creating new conversation between", user?._id, selectedFriend?._id, newConversationRes);
            conversationId = newConversationRes.data?._id;
            const res = await axios.patch(`/user/conversation/`, {
                "senderId": user?._id, 
                "receiverId": selectedFriend?._id, 
                "conversationId": conversationId ?? ""
                });
        }
        setConversationId(conversationId);
    }

    useEffect(()=>{
        if(selectedFriend){
            initiateLoadChat();
            console.log("selectedFriend",selectedFriend);
        }
    },[selectedFriend]);

    useEffect(() => {
        const getFriends = async () => {
            try {
                const following = await axios.get(`/user/following/${user?._id}`);
                const followers = await axios.get(`/user/followers/${user?._id}`);
                setFriends([...following.data, ...followers.data]);
                setFriendsList([...following.data, ...followers.data]);
            } catch (err) {
                console.log(err);
            }
        };
        getFriends();
    }, [user]);

    useEffect(() => {
        socket.current = io("ws://localhost:8900");    
        socket.current.on("getMessage", (data) => {
            setArrivalMessage({
                sender: data?.senderId,
                receiver: data?.receiverId,
                text: data?.text,
                imageUrl: data?.imageUrl ?? "",
                type: data?.type ?? "",
                createdAt: Date.now(),
            });
        });
        return () => {
            socket.current.disconnect();
        };
    }, []);

    useEffect(() => {
        console.log("arrival message", arrivalMessage, user)
        if (arrivalMessage && user?._id==arrivalMessage?.receiver) {
            setMessages((prev) => [...prev, arrivalMessage]);
        }
    }, [arrivalMessage]);

    useEffect(() => {
        const scrollToBottom = () => {
          if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
          }
        };
        scrollToBottom();
      }, [messages]);

    useEffect(() => {
        if(user){
            socket.current.emit("addUser", user?._id);
            socket.current.on("getUsers", (users) => {
            // setOnlineUsers(user.following.filter((f) => users.some((u) => u?.userId === f)));
        });
        }
    }, [user]);

    useEffect(() => {
        const getMessages = async () => {
            try {
                if (conversationId) {
                    const res = await axios.get(`/messages/${conversationId}`);
                    setMessages(res?.data);
                    console.log("messages", res?.data)
                }
            } catch (err) {
                console.log(err);
            }
        };
        getMessages();
    }, [conversationId, selectedFriend]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if conversation exists
        console.log("start chatting with", selectedFriend?._id, file);
        // Create and send the message
        try {
            const message = {
                senderId: user?._id,
                receiverId: selectedFriend?._id,
                text: newMessage,
            }
            const saveMessage = {
                conversationId: conversationId,
                sender: user?._id,
                text: newMessage
            }
            if(file){
                const data=new FormData();
                const filename = Date.now()+file.name;
                data.append("name", filename);
                data.append("file", file);
                message.type=isImage(filename)?"image": "video";
                saveMessage.type=isImage(filename)?"image": "video";
                try{
                    const res = await axios.post("/upload", data);
                    if(res.data.message=="Image uploaded and saved successfully" && res.status==200){
                        message.imageUrl=res.data.fileId;
                        saveMessage.imageUrl = res.data.fileId;
                    }
                    socket.current.emit("sendMessage", message);
                    const response = await axios.post(`/messages`, saveMessage);
                    console.log("see message",file, message, messages);
                    if(response?.data){
                        setFile(null);
                        setMessages(prevMessages => [...prevMessages, response?.data]);
                        setNewMessage(""); // Clear the input field after sending the message
                        scrollRef.current.scrollIntoView({ behavior: "smooth" });
                    }
                    
                }catch(err){
                    console.log(err);
                }
            }else{
                socket.current.emit("sendMessage", message);
                const res = await axios.post(`/messages`, saveMessage);
                if(res?.data){
                console.log('see message',file, message, messages);
                setFile(null);
                setMessages(prevMessages => [...prevMessages, res?.data]);
                setNewMessage(""); // Clear the input field after sending the message
                scrollRef.current.scrollIntoView({ behavior: "smooth" });
                }
            }
            
        } catch (err) {
            console.log(err);
        }
    };
    const searchFriend=(e)=>{
        if(e?.target?.value){
            setFriendsList(friends.filter((friend)=>friend.username.includes(e.target.value)));
        }else{
            setFriendsList(friends);
        }
    }

    return (
        <>
            <Topbar />
            <div className="messenger">
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <div className='searchWrapper'>
                            <div style={{marginLeft: '8px', marginTop: '4px'}}><Search /></div>
                        <input placeholder="Search for friends" className="chatMenuInput" style={{border: "none"}} onChange={(e)=>{searchFriend(e)}} /></div>
                        <ul className="chattingFriendList">
                            {friendList.map((u) => {return <CloseFriend key={u?._id} user={u} setSelectedFriend={setSelectedFriend} selectedFriend={selectedFriend}  />})}
                        </ul>
                    </div>
                </div>
                <div className="chatBox">
                    <div className="chatBoxWrapper">
                        {selectedFriend ? (
                            <>
                                <div className="chatBoxTop" ref={chatBoxRef}>
                                    {messages.map(m => (
                                        <div key={m?._id} ref={scrollRef}>
                                            <Message message={m} own={m?.sender === user?._id} otheruser={selectedFriend} curruser={user} />
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                        {file && <div><div className="">
                                            <img className="shareImg" src={URL.createObjectURL(file)} alt=""/>
                                            <Cancel className="shareCancelImg" onClick={()=>setFile(null)}/>
                                            </div>
                                        </div>}
                                    <form className="chatBottomForm" onSubmit={handleSubmit}>
                                        <div className='chatMessage'>
                                        <div><label htmlFor="file"><PermMedia htmlColor="tomato"/>
                                            <input style={{display: "none"}} type="file" id="file" onChange={(e)=>setFile(e.target.files[0])}/>
                                            </label></div>
                                            <textarea className='chatMessageInput' placeholder="Enter your message..." onChange={(e) => setNewMessage(e.target.value)} value={newMessage}/>
                                        </div>
                                        
                                        
                                        <div><button className="shareButton" type="submit">Send</button></div>
                                    
                                </form> 
                        </div>
                            </>
                        ) : (
                             <span className='noConversation'>Open a conversation to start a chat.</span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
