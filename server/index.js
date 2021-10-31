const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const app = express()

const routes = require("./routes/routes")

mongoose.connect('mongodb://localhost/music', {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

const db = mongoose.connection
const PORT = 8000

db.on('error', (error) => console.error(error))
db.once('open', () => console.log("Connected to database"))

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use("/api", routes)

app.listen(PORT, console.log(`Server started on port ${PORT}`))
