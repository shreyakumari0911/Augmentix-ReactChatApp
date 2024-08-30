const io=require("socket.io")(8900,{
    cors:{
        origin: "http://localhost:3000",
    },
});

let users=[];

const addUser = (userId, socketId) =>{
!users.some((user)=>user.userId==userId) && users.push({userId, socketId});
}


const removeUser=(socketId)=>{
    users=users.filter((user)=> user.socketId !== socketId);
}

const getUser= (userId)=>{
    return users.find(user=>user.userId === userId);
}

io.on("connection", (socket)=>{

    // console.log("user connected");
    // take user socket id from client
    socket.on("addUser", userId=>{
        addUser(userId, socket.id);
        console.log("user added", userId, socket.id);
        io.emit("getUsers", users);
    });

    // send message and get message
   socket.on("sendMessage", ({ senderId, receiverId, text, imageUrl, type }) => {
  console.log("Sending message", senderId, receiverId, text, imageUrl, type);
  const user = getUser(receiverId);
  if (user?.socketId) {
    console.log("Emitting to", users);
    io.to(user.socketId).emit("getMessage", {
      senderId,
      receiverId,
      text,
      imageUrl,
      type,
    });
  }
});

    socket.on("disconnected", ()=>{
        console.log("a user Disconnected");
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});