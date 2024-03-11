import { webhookExists, createNewHook } from '../model/GitlabAPIWebhook.js'

export const webhookController = {}

/**
 * Check if an appropriate webhook exists. If it doesn't, create one.
 *
 * @param {object} req The request.
 * @param {object} res The response.
 */
webhookController.createWebhookProcess = async (req, res) => {
  const projectID = req.body.proj_id
  const token = req.session.access_token

  if (!await webhookExists(projectID, token)) { // create new webhook
    const webhookInfo = await createNewHook(projectID, token)
    if (webhookInfo) {
      req.session.project_id = projectID
      res.redirect('/assignment/issues')
    }
  }
}
