import { strings } from '../const/strings.js'
import { getAccessToken, GitLabAuthorizationCodeRequest } from '../model/GitlabAPIOauth.js'
import crypto from 'crypto'
import base64url from 'base64url'

export const OAuthController = {}

/**
 * Send to Gitlab to click on authorize to authorize the application (O-Auth).
 *
 * @param {object} req The request.
 * @param {object} res The response.
 */
OAuthController.authorizationProcess = async (req, res) => {
  const randomLength = Math.floor(Math.random() * (128 - 43 + 1)) + 5 // between 43 and 128
  const codeVerifier = generateRandomString(randomLength)
  process.env.CODE_VERIFIER = codeVerifier
  const codeChallenge = generateCodeChallenge()
  const state = generateRandomString(32)
  GitLabAuthorizationCodeRequest(res, state, codeChallenge)
}

/**
 * Request the access token to Gitlab (after user has authorized the application).
 * This method is called after Gitlab processes the authorization request.
 *
 * @param {object} req The request.
 * @param {object} res The response.
 * @returns {object} The home view (for special cases where the client moves backwards in the browser url)
 */
OAuthController.requestAccessToken = async (req, res) => {
  const authorizationCode = req.query.code
  if (req.session.authorization_code === authorizationCode) {
    return res.render('partials/home', { layout: 'index', enabled: req.session.enabled, flashmessage: req.session.flashmessage })
  }
  const data = await getAccessToken(authorizationCode)
  req.session.access_token = data.access_token
  process.env.ACCESS_TOKEN = data.access_token
  req.session.refresh_token = data.refresh_token
  process.env.REFRESH_TOKEN = data.refresh_token
  req.session.authorization_code = authorizationCode
  req.session.enabled = true
  req.session.flashmessage = strings.MSG_ACCESS_GRANTED
  res.render('partials/home', { layout: 'index', enabled: req.session.enabled, flashmessage: req.session.flashmessage })
}

/**
 * Creates a random string (for the authorization process).
 *
 * @param {number} length The length (must be between 43 and 128).
 * @returns {string} A random string.
 */
function generateRandomString (length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Create a code challenge (O-Auth).
 *
 * @returns {string} The code challenge.
 */
function generateCodeChallenge () { // TRANSFORMS THE EXAMPLE STRING IN GITLAB PERFECTLY
  const hash = crypto.createHash('sha256').update(process.env.CODE_VERIFIER).digest() // Calculate SHA256 hash of the code verifier
  const codeChallenge = base64url(hash) // Encode the hash into a URL-safe string
  return codeChallenge
}

/**
 * Logs the user out.
 *
 * @param {object} req The request.
 * @param {object} res The response.
 */
OAuthController.logout = async (req, res) => {
  req.session.access_token = undefined
  req.session.refresh_token = undefined
  req.session.enabled = false
  req.session.flashmessage = strings.MSG_LOGOUT
  delete process.env.ACCESS_TOKEN
  delete process.env.REFRESH_TOKEN
  delete process.env.CODE_VERIFIER
  res.render('partials/home', { layout: 'index', flashmessage: req.session.flashmessage })
}
