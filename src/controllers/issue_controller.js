import { strings } from '../const/strings.js'
import { webhookExists } from '../model/GitlabAPIWebhook.js'
import { getIssues } from '../model/GitlabAPIIssueRetrieval.js'

export const issueController = {}

/**
 * Call the getIssues method and render the issue list.
 *
 * @param {object} req The request.
 * @param {object} res The response.
 */
issueController.showIssues = async (req, res) => {
  let projectID
  if (req.body.proj_id) {
    projectID = req.body.proj_id
  } else if (req.session.project_id) {
    projectID = req.session.project_id
  }
  const token = req.session.access_token

  if (!await webhookExists(projectID, token)) {
    req.session.flashmessage = strings.MSG_NEED_NEW_HOOK
    res.render('partials/createWebhook', { layout: 'index', enabled: req.session.enabled, flashmessage: req.session.flashmessage, project_id: projectID })
  } else {
    const issueData = await getIssues(projectID, token)
    res.render('partials/issues', {
      layout: 'index',
      enabled: req.session.enabled,
      issues: issueData
    })
  }
}

/**
 * Render the home page.
 *
 * @param {object} req The request.
 * @param {object} res The response.
 */
issueController.showHome = async (req, res) => {
  res.render('partials/home', {
    layout: 'index',
    enabled: req.session.enabled
  })
}

/**
 * Call the getIssues method and render the issue list.
 *
 * @param {object} req The request.
 * @param {object} res The response.
 */
issueController.showProjectSelection = async (req, res) => {
  req.session.flashmessage = strings.MSG_SELECT_PROJECT
  res.render('partials/selectProject', {
    layout: 'index',
    enabled: req.session.enabled,
    flashmessage: req.session.flashmessage
  })
}
