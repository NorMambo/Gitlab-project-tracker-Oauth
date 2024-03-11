import express from 'express'
import logger from 'morgan'
import path from 'path'
import session from 'express-session'
import { fileURLToPath } from 'url'
import { strings } from './const/strings.js'
import hbs from 'express-hbs'
import { issueRouter } from './routes/issue_router.js'
import { accessRouter } from './routes/access_router.js'
import { webhookRouter } from './routes/webhook_router.js'

import wsServer from './controllers/websocketClientEvent_controller.js'
import { config } from 'dotenv'

config()

const __filename = fileURLToPath(import.meta.url) // ES6 version of __filename
const __dirname = path.dirname(__filename) // ES6 version of __dirname
export const __prefix = path.join(__dirname, 'views')
const port = process.env.PORT

export const app = express()

app.use(logger('dev'))
hbs.registerHelper('eq', function (arg1, arg2) {
  return arg1 === arg2
})
app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views/partials',
  layoutsDir: __dirname + '/views/layouts'
}))
app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')
app.use(express.json())
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.urlencoded({ extended: true })) // allows to access req.body data from POST or PUT requests

app.use(session({
  cookie: {
    maxAge: 2 * 60 * 60 * 1000 // session lasts 2 hours
    // maxAge: 1000 // 1 second
  },
  resave: false, // don't save session if unmodified
  saveUninitialized: true, // true = create session even before something is stored
  secret: 'stronghold' // a secret string used to sign the session ID cookie
}))

app.use((req, res, next) => { // takes the flashmessage from the request.session and assingns it to res.data
  res.data = {}
  res.data.flashmessage = null
  if (req.session && req.session.flashmessage) {
    res.data.flashmessage = req.session.flashmessage
    req.session.flashmessage = null
  }
  next()
})

app.use('/', issueRouter)

app.use('/access/', accessRouter)

app.use('/webhook/', webhookRouter)

app.use((req, res, next) => {
  res.status(404).send(strings.MSG_404)
})

app.use((err, req, res, next) => {
  res.status(500).send(strings.MSG_500)
  console.log(err)
})

/**
 * Export () as the default method of app.
 * In app.js, import app and use app(). This will automatically call listen.
 */
export default () => {
  const server = app.listen(port, () => {
    console.log(`App is listening at ${port}. NODE_ENV is set to ${process.env.NODE_ENV}`)
  })
  server.on('upgrade', (request, socket, head) => { // When a WebSocket upgrade request is received (when a client wants to establish a WebSocket connection with the server)
    wsServer.handleUpgrade(request, socket, head, socket => {
      wsServer.emit('connection', socket, request)
    })
  })
}
