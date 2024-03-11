import wsServer from './websocketClientEvent_controller.js'
import WebSocket from 'ws'
import * as emoji from 'node-emoji'

export const GitLabEventController = {}

/**
 * Handles incoming issue modifications from GitLab (via the webhook).
 * The changes are broadcast to the clients via the websocket.
 *
 * @param {object} req The request.
 * @param {object} res The response.
 */
GitLabEventController.handleWebhookChanges = async (req, res) => {
  const data = req.body

  if (req.body.changes) {
    if (data.object_kind === 'issue') {
      if ('state_id' in data.changes) {
        let state
        if (data.changes.state_id.current === 1) {
          state = 'opened'
        } else {
          state = 'closed'
        }
        const obj = {
          type: 'state_change_gitlab',
          iid: data.object_attributes.iid,
          current: state
        }
        broadcast(obj)
      }

      if ('description' in data.changes) {
        const obj = {
          type: 'description_change_gitlab',
          iid: data.object_attributes.iid,
          current: data.changes.description.current
        }
        broadcast(obj)
      }

      if ('labels' in data.changes) {
        const listOfLabels = []
        data.changes.labels.current.forEach(entry => {
          const obj = {
            id: entry.id,
            title: entry.title,
            color: entry.color
          }
          listOfLabels.push(obj)
        })
        const obj = {
          type: 'labels_change_gitlab',
          iid: data.object_attributes.iid,
          current: listOfLabels
        }
        broadcast(obj)
      }
    }
  }

  if (data.object_kind === 'emoji') {
    if (data.event_type === 'award') {
      const obj = {
        type: 'emoji_gitlab',
        iid: data.issue.iid,
        action: 'award',
        name: data.object_attributes.name,
        symbol: emoji.get(data.object_attributes.name) === undefined ? data.object_attributes.name : emoji.get(data.object_attributes.name),
        award_id: data.object_attributes.id
      }
      broadcast(obj)
    } else {
      const obj = {
        type: 'emoji_gitlab',
        iid: data.issue.iid,
        action: 'revoke',
        name: data.object_attributes.name,
        award_id: data.object_attributes.id
      }
      broadcast(obj)
    }
  }
  res.sendStatus(200)
}

/**
 * Broadcasting stuff.
 *
 * @param {object} obj Object containing the info.
 */
function broadcast (obj) {
  wsServer.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      console.log('Sending through websocket: ', JSON.stringify(obj))
      client.send(JSON.stringify(obj))
    }
  })
}
