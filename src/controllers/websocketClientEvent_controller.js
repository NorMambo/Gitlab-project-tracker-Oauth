import WebSocket, { WebSocketServer } from 'ws'
import { APIRequests } from '../model/GitlabAPIIssueChanges.js'

export const wsServer = new WebSocketServer({
  noServer: true,
  clientTracking: true
})

export default wsServer

wsServer.on('connection', (ws) => {
  console.log('WSS connection received. Adding client.')
  wsServer.broadcast(`New client connected (${wsServer.clients.size}).`)

  const heartbeatInterval = setInterval(() => {
    sendHeartbeat(ws)
  }, 30000)

  ws.on('message', (data) => {
    try {
      const info = JSON.parse(data)
      console.log('ws got: ', info)
      if (info.type === 'status_change_client') {
        APIRequests.clientToGitlabStatusChange(info)
      }

      if (info.type === 'description_change_client') {
        APIRequests.clientToGitlabDescriptionChange(info)
      }

      if (info.type === 'emoji_client') {
        if (info.action === 'revoke') {
          APIRequests.clientToGitlabEmojiRevoke(info)
        }
      }

      if (info.type === 'label_add_client') {
        APIRequests.clientToGitlabAddLabel(info)
      }

      if (info.type === 'label_remove_client') {
        APIRequests.clientToGitlabRemoveLabel(info)
      }
    } catch (error) {
      console.error(error)
    }
  })

  ws.on('close', () => {
    clearInterval(heartbeatInterval)
    console.info('Client closed connection')
  })
  ws.on('error', console.error)
})

/**
 * Broadcast to everyone except the server.
 *
 * @param {object} data The data to broadcast.
 */
wsServer.broadcast = (data) => {
  let clients = 0

  wsServer.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      clients++
      client.send(JSON.stringify({
        type: 'info',
        info: data
      }))
    }
  })
  console.log(`Broadcasted data to ${clients} (${wsServer.clients.size}) clients.`)
}

/**
 * Send a constant message to clients to keep the connection alive.
 *
 * @param {WebSocket} ws The websocket.
 */
function sendHeartbeat (ws) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'heartbeat' }))
  }
}
