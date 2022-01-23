import { Server } from "socket.io"


let usersOnline = []
let usersTyping = []

const startSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    }
  })

  io.on('connection', (socket) => {

    io.emit('sendUsersOnline', usersOnline)

    socket.on('sendUserOnline', (userId) => {
      const userOnline = { userId, socketId: socket.id }

      if (!usersOnline.find((user) => user.userId === userId)) {
        usersOnline.push(userOnline)
      }

      io.emit('sendUserOnline', userOnline)
    })

    socket.on('sendMessage', ({ message, receiverId }) => {
      const receiver = usersOnline.find((u) => u.userId === receiverId)
      if (receiver) {
        io.to(receiver.socketId).emit('sendMessage', message)
      }
    })
    
    socket.on('disconnect', () => {
      const userOffline = usersOnline.find((user) => user.socketId === socket.id)

      usersOnline = usersOnline.filter((user) => user.socketId !== socket.id)

      io.emit('sendUserOffline', userOffline)
    })

  })
}

export default startSocket
