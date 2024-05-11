const verifyToken = (req,res) => {
    res.send("hola VerifyToken")
}

const receivedMessage = (req,res) => {
    res.send("hola Received")
}

module.exports = { verifyToken, receivedMessage }