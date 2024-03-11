import { urls } from '../const/strings.js'
import { putRequest, deleteRequest } from './requests.js'
export const APIRequests = {}

/**
 * Send description change of an issue to Gitlab.
 *
 * @param {object} JSONdata The JSON object containing the modified description.
 */
APIRequests.clientToGitlabDescriptionChange = async (JSONdata) => {
  const url = urls.GITLAB_API_PROJ_URL
    .concat('/')
    .concat(JSONdata.projectID)
    .concat('/issues/')
    .concat(JSONdata.iid)
    .concat('?description=')
    .concat(encodeURIComponent(JSONdata.current.trim()))
  putRequest(url)
}

/**
 * Send status change of an issue to Gitlab.
 *
 * @param {object} JSONdata The JSON object containing the modified description.
 */
APIRequests.clientToGitlabStatusChange = async (JSONdata) => {
  let newStatus
  if (JSONdata.current === 1) {
    newStatus = 'reopen'
  } else {
    newStatus = 'close'
  }
  const url = urls.GITLAB_API_PROJ_URL
    .concat('/')
    .concat(JSONdata.projectID)
    .concat('/issues/')
    .concat(JSONdata.iid)
    .concat('?state_event=')
    .concat(newStatus)
  putRequest(url)
}

/**
 * Revoke emoji to an issue to Gitlab.
 *
 * @param {object} JSONdata The JSON object containing the awarded emoji.
 */
APIRequests.clientToGitlabEmojiRevoke = async (JSONdata) => {
  const url = urls.GITLAB_API_PROJ_URL
    .concat('/')
    .concat(JSONdata.projectID)
    .concat('/issues/')
    .concat(JSONdata.iid)
    .concat('/award_emoji/')
    .concat(JSONdata.awardID)
  deleteRequest(url)
}

/**
 * Revoke emoji to an issue to Gitlab.
 *
 * @param {object} JSONdata The JSON object containing the awarded emoji.
 */
APIRequests.clientToGitlabAddLabel = async (JSONdata) => {
  const commaSeparatedStr = JSONdata.current.map(element => element.text).join(',')
  const url = urls.GITLAB_API_PROJ_URL
    .concat('/')
    .concat(JSONdata.projectID)
    .concat('/issues/')
    .concat(JSONdata.iid)
    .concat('?labels=')
    .concat(commaSeparatedStr)
  putRequest(url)
}

/**
 * Revoke emoji to an issue to Gitlab.
 *
 * @param {object} JSONdata The JSON object containing the awarded emoji.
 */
APIRequests.clientToGitlabRemoveLabel = async (JSONdata) => {
  const url = urls.GITLAB_API_PROJ_URL
    .concat('/')
    .concat(JSONdata.projectID)
    .concat('/issues/')
    .concat(JSONdata.iid)
    .concat(`?remove_labels=${JSONdata.current},`) // Comma-separated label names to remove from an issue.
  putRequest(url)
}
