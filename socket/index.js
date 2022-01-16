import { Server } from "socket.io"


let usersOnline = []

const startSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    }
  })

  io.on('connection', (socket) => {
    socket.emit('getUsersOnline', usersOnline)

    socket.on('sendUser', (userId) => {
      if (!usersOnline.find((user) => user.userId === userId)) {
        usersOnline.push({ userId, socketId: socket.id})
      }
      io.emit('getUsersOnline', usersOnline)
    })

    socket.on('disconnect', () => {
      console.log('disconnected')
      usersOnline = usersOnline.filter((user) => user.socketId !== socket.id)

      io.emit('getUsersOnline', usersOnline)
    })

    socket.on('sendMessage', ({ message, receiverId }) => {
      const receiver = usersOnline.find((u) => u.userId === receiverId)
      if (receiver) {
        console.log('send')
        io.to(receiver.socketId).emit('sendMessage', message)
      }
    })

    socket.on('message', (message) => {
      console.log(message)
    })
  })
}

export default startSocket
