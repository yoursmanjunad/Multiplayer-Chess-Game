const socket = io()
socket.emit('Manjunath')
socket.on('Sunnetha', function() {
    console.log("Sunnetha is here")
})