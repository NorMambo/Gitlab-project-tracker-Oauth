import { urls } from '../const/strings.js'

/**
 * Check if a webhook for this project already exists.
 *
 * @param {number} ID The project ID.
 * @param {string} token The access token.
 * @returns {boolean} True if webhook exists, otherwise false.
 */
export async function webhookExists (ID, token) {
  const response = await fetch(`${urls.API_URL}/${ID}/hooks`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!response.ok) {
    throw new Error(`Gitlab API request failed with status ${response.status}`)
  }
  const hookList = await response.json()
  if (hookList.length > 0) {
    for (const hook of hookList) {
      if (hook.project_id === parseInt(ID) && hook.url === urls.WEBHOOK_ENDPOINT) {
        return true
      }
    }
  }
  return false
}

/**
 * Creates a new webhook for a specific project.
 *
 * @param {number} ID The project ID.
 * @param {string} token The O-auth token.
 * @returns {object} The details about the created webhook.
 */
export async function createNewHook (ID, token) {
  const hookOptions = {
    url: urls.WEBHOOK_ENDPOINT,
    push_events: true,
    tag_push_events: true,
    issues_events: true,
    confidential_issues_events: true,
    note_events: true,
    confidential_note_events: true,
    merge_requests_events: true,
    pipeline_events: true,
    wiki_page_events: true,
    deployment_events: true,
    emoji_events: true,
    enable_ssl_verification: true
  }

  const response = await fetch(`${urls.API_URL}/${ID}/hooks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(hookOptions)
  })

  if (!response.ok) {
    throw new Error(`Gitlab API request failed with status ${response.status}`)
  }

  const data = await response.json()
  return data
}
