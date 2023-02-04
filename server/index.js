const express = require('express')
const cors = require('cors')
const router = require('./routers/index')
const errorMiddleware = require('./middleware/errorHandlingMiddleware')

const app = new express()
const PORT = 5000 || process.env.PORT

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: ['http://localhost:3000','https://heroic-profiterole-cc695c.netlify.app', 'https://main--voluble-pegasus-6a9597.netlify.app','https://voluble-pegasus-6a9597.netlify.app']
}))
app.use('/', router)
app.use(errorMiddleware)


async function start(){
    try{
        app.listen(PORT, () => {
            console.log(`Server started on PORT: ${PORT}`)
        })
    }catch (e){
        console.log(e)
    }
}

module.exports = start
