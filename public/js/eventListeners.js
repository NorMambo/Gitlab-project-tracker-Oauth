import { sendChanges } from './websocketClient.js'

const selectList = document.querySelectorAll('.slim-select')
export const slimSelects = []
let projectID
if (document.querySelector('.issue-grid')) {
  projectID = document.querySelector('.issue-grid').classList[1]
}

document.addEventListener('DOMContentLoaded', () => {
  selectList.forEach(slimSelect => {
    const iid = slimSelect.parentNode.classList[1].charAt(1)
    const ss = new SlimSelect({
      select: slimSelect,
      settings: {
        showSearch: false,
        placeholderText: 'LABELS',
        hideSelected: true
      },
      events: {
        /**
         * Check to see if a value was removed or added (to the label bar).
         *
         * @param {Array} newVal The list of new values.
         * @param {Array} oldVal The list of old values.
         * @returns {boolean} doesn't allow the change to be visualized right away. First it needs to go through the server and come back.
         */
        beforeChange: (newVal, oldVal) => {
          const newlySelected = newVal.filter(value => !oldVal.includes(value))
          const deselected = oldVal.filter(value => !newVal.includes(value))
          if (newlySelected.length > 0) {
            sendChanges(projectID, 'label_add_client', iid, newVal)
          }
          if (deselected.length > 0) {
            sendChanges(projectID, 'label_remove_client', iid, deselected[0].text)
          }
          return false
        }
      }
    })
    slimSelects.push(ss)
  })
})

const descriptionList = document.querySelectorAll('.issue-description')
const statusButtonList = document.querySelectorAll('.status-button')
const emojiList = document.querySelectorAll('.emoji')

statusButtonList.forEach((button) => {
  button.addEventListener('click', e => {
    const status = document.querySelector(`.state-bar.${e.target.classList[2]}`)
    const iid = parseInt(status.classList[1].charAt(1))
    if (status.innerText === 'opened') {
      sendChanges(projectID, 'status_change_client', iid, 2)
    }
    if (status.innerText === 'closed') {
      sendChanges(projectID, 'status_change_client', iid, 1)
    }
  })
})

descriptionList.forEach((description) => {
  description.addEventListener('click', e => {
    const description = document.querySelector(`.issue-description.${e.target.classList[2]}`)
    const textarea = document.querySelector(`.modify-description-textarea.${e.target.classList[2]}`)
    description.classList.add('hidden')
    textarea.classList.remove('hidden')
    const iid = parseInt(description.classList[2].charAt(1))
    textarea.focus()
    textarea.addEventListener('keydown', e => {
      if (e.key === 'Enter' && e.shiftKey) {
        e.preventDefault()
        if (textarea.value !== description.innerText) {
          sendChanges(projectID, 'description_change_client', iid, textarea.value)
        }
        description.classList.remove('hidden')
        textarea.classList.add('hidden')
      }
    })
  })
})

emojiList.forEach((emoji) => {
  addEmojiEventListener(emoji)
})

/**
 * Add the emoji event listener.
 *
 * @param {object} emoji The emoji that reacts to a click.
 */
export function addEmojiEventListener (emoji) {
  emoji.addEventListener('click', e => { // click an emoji only to revoke it
    const iid = emoji.classList[1].charAt(1)
    const emojiName = emoji.classList[2]
    const awardID = emoji.classList[3]
    sendChanges(projectID, 'emoji_client', iid, emojiName, awardID, 'revoke')
  })
}
