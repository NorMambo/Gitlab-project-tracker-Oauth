import { Router } from 'express'
import { isLoggedIn, projectExists } from './security_middleware.js'
import { issueController } from '../controllers/issue_controller.js'

export const issueRouter = Router()

issueRouter.get('/', issueController.showHome)

issueRouter.get('/issues', isLoggedIn, issueController.showIssues)

issueRouter.get('/projectselect', isLoggedIn, issueController.showProjectSelection)

issueRouter.post('/find-issue', isLoggedIn, projectExists, issueController.showIssues)
