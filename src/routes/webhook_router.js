import { Router } from 'express'
import { restrictToGitlab, isLoggedIn } from './security_middleware.js'
import { webhookController } from '../controllers/webhook_controller.js'
import { GitLabEventController } from '../controllers/gitlabEvent_controller.js'

export const webhookRouter = Router()

webhookRouter.post('/gitlab-issue-data.json', restrictToGitlab, GitLabEventController.handleWebhookChanges)

webhookRouter.post('/webhook-auth', isLoggedIn, webhookController.createWebhookProcess)
