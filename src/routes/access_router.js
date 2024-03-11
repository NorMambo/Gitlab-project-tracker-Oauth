import { Router } from 'express'
import { OAuthController } from '../controllers/OAUTH_controller.js'
import { noToken, restrictToGitlab } from './security_middleware.js'

export const accessRouter = Router()

accessRouter.get('/login', noToken, OAuthController.authorizationProcess)

accessRouter.get('/logout', OAuthController.logout)

accessRouter.get('/callback', restrictToGitlab, OAuthController.requestAccessToken)
