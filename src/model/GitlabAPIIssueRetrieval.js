import { urls, strings } from '../const/strings.js'
import * as emoji from 'node-emoji'

/**
 * Make the necessary API calls to get the issues (and interesting details about them) from Gitlab.
 *
 * @param {number} ID The project ID.
 * @param {string} accessToken The access token.
 * @returns {Array | null} The array of issues for this project.
 */
export async function getIssues (ID, accessToken) {
  try {
    const response = await fetch(`${urls.API_URL}/${ID}/issues`.concat(urls.LABEL_QUERY), {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (!response.ok) {
      throw new Error(`Gitlab API request failed with status ${response.status}`)
    }

    const issuedata = await response.json()

    const response2 = await fetch(`${urls.API_URL}/${ID}/labels`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    })

    if (!response2.ok) {
      throw new Error(`Gitlab API request failed with status ${response2.status}`)
    }

    const projectLabels = await response2.json()

    for (const issue of issuedata) { // A SEPARATE API CALL FOR EACH ISSUE TO ACCESS THE RESPECTIVE LIST OF EMOJIS
      const url = issue._links.award_emoji
      const emojiAwardResponse = await fetch(url, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
      if (!emojiAwardResponse.ok) {
        throw new Error(`Gitlab API request failed with status ${emojiAwardResponse.status}`)
      }
      const issueEmojiArray = await emojiAwardResponse.json() // list of emojis for 1 issue
      const emojiArray = []
      issueEmojiArray.forEach(e => {
        if (e.name === 'thumbsup') {
          emojiArray.push({ name: e.name, symbol: '👍', award_id: e.id }) // manually handling some common emojis (gitlab offers non-conventional emoji-names that emoji(npm) doesn't recongnize)
        } else if (e.name === 'thumbsdown') {
          emojiArray.push({ name: e.name, symbol: '👎', award_id: e.id }) // manually handling some common emojis (gitlab offers non-conventional emoji-names that emoji(npm) doesn't recongnize)
        } else {
          emojiArray.push(emoji.get(e.name) === undefined ? { name: e.name, symbol: e.name, award_id: e.id } : { name: e.name, symbol: emoji.get(e.name), award_id: e.id })
        }
      })
      issue.emojiList = emojiArray // assign a new key (emojiList) to every issue of the GitLab data issueList

      const updatedProjectLabels = projectLabels.map(projectLabel => ({
        ...projectLabel,
        selected: issue.labels.some(issueLabel => issueLabel.id === projectLabel.id)
      }))

      issue.labels = updatedProjectLabels
    }
    return issuedata
  } catch (err) {
    console.error(strings.MSG_FETCH_ISSUE_ERR, err)
    return null
  }
}
