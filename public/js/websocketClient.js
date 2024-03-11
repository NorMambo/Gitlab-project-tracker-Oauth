import { addEmojiEventListener } from './eventListeners.js'

const wsURI = 'wss://cscloud6-120.lnu.se/assignment/'
const ws = new WebSocket(wsURI)

ws.addEventListener('message', (event) => {
  try {
    const changes = JSON.parse(event.data)
    if (changes.type !== 'heartbeat' || changes.type !== 'info') { // REMOVE THIS AFTERWARDS
      console.log('Message from server: ', changes)
    }

    if (changes.type === 'state_change_gitlab') {
      const stateBar = document.querySelector(`.state-bar.I${changes.iid}`)
      stateBar.innerText = changes.current
      if (changes.current === 'opened') {
        stateBar.style.backgroundColor = 'lightgreen'
      } else {
        stateBar.style.backgroundColor = 'red'
      }
    }

    if (changes.type === 'description_change_gitlab') {
      const description = document.querySelector(`.issue-description.I${changes.iid}`)
      const textarea = document.querySelector(`.modify-description-textarea.I${changes.iid}`)
      textarea.value = changes.current
      description.innerText = changes.current
    }

    if (changes.type === 'emoji_gitlab') {
      const emojiPanel = document.querySelector(`.emoji-panel.I${changes.iid}`)
      if (changes.action === 'award') {
        const em = document.createElement('div')
        em.classList.add('emoji', `I${changes.iid}`, `${changes.name}`, `${changes.award_id}`)
        if (changes.symbol === 'thumbsup') {
          em.innerText = '👍'
        } else if (changes.symbol === 'thumbsdown') {
          em.innerText = '👎'
        } else {
          em.innerText = changes.symbol
        }
        addEmojiEventListener(em)
        emojiPanel.appendChild(em)
      }
      if (changes.action === 'revoke') {
        const tmp = document.querySelector(`.emoji.${changes.name}.I${changes.iid}`)
        emojiPanel.removeChild(tmp)
      }
    }

    if (changes.type === 'labels_change_gitlab') {
      const labelDropDown = document.getElementById(`slim-select-I${changes.iid}`).slim // SlimSelect
      const options = []
      changes.current.forEach(labelInfo => {
        options.push(labelInfo.id)
      })
      labelDropDown.setSelected(options.map(value => String(value)))
    }
  } catch (err) {
    console.error(err)
  }
})

/**
 * Send changes through websocket.
 *
 * @param {number} projectID The project id.
 * @param {string} type The type of modification to the issue.
 * @param {number} iid The issue ID.
 * @param {object} changes The edited part of the issue.
 * @param {number} awardID The award ID (for emojis).
 * @param {string} action The action (award or revoke).
 */
export async function sendChanges (projectID, type, iid, changes, awardID, action) {
  const changesObj = {
    type,
    projectID,
    iid,
    current: changes,
    awardID,
    action
  }
  ws.send(JSON.stringify(changesObj))
}
