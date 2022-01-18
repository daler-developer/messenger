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
    io.emit('sendUsersTyping', usersTyping)

    socket.on('sendUserTyping', (userId) => {
      const userTyping = { userId, socketId: socket.id }

      if (!usersTyping.find((user) => user.userId === userId)) {
        usersTyping.push(userTyping)
      }

      io.emit('sendUserTyping', userTyping)
    })

    socket.on('sendUserNotTyping', (userId) => {
      const userNotTyping = { userId, socketId: socket.id }

      usersOnline = usersOnline.filter((user) => user.socketId !== socket.id)
    })

    socket.on('sendUserOnline', (userId) => {
      const userOnline = { userId, socketId: socket.id }

      if (!usersOnline.find((user) => user.userId === userId)) {
        usersOnline.push(userOnline)
      }

      io.emit('sendUserOnline', userOnline)
    })

    socket.on('disconnect', () => {
      const userOffline = usersOnline.find((user) => user.socketId === socket.id)

      usersOnline = usersOnline.filter((user) => user.socketId !== socket.id)

      io.emit('sendUserOffline', userOffline)
    })

  })
}

export default startSocket
