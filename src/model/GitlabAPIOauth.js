import { urls, ids } from '../const/strings.js'

/**
 * Sends the user to their GITLAB page to authorize the request by the app.
 *
 * @param {object} res The response.
 * @param {string} state Needed code for OAUTH.
 * @param {string} codeChallenge Needed for authentication (OAUTH).
 */
export async function GitLabAuthorizationCodeRequest (res, state, codeChallenge) {
  res.redirect(`https://gitlab.lnu.se/oauth/authorize?client_id=${ids.APP_ID}&redirect_uri=${urls.REDIRECT_URL_OAUTH}&response_type=code&state=${state}&scope=api&code_challenge=${codeChallenge}&code_challenge_method=S256`)
}

/**
 * Get the authenticaion code from Gitlab (O-Auth).
 *
 * @param {string} authCode The authentication code.
 * @returns {object} The JSON object containing the authentication code.
 */
export async function getAccessToken (authCode) {
  const params = {
    client_id: ids.APP_ID,
    code: authCode,
    grant_type: 'authorization_code',
    redirect_uri: urls.REDIRECT_URL_OAUTH,
    code_verifier: process.env.CODE_VERIFIER
  }
  const response = await fetch(urls.AUTH_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  })
  if (!response.ok) {
    throw new Error(`Gitlab AUTH TOKEN request failed with status ${response.status}`)
  }
  const data = await response.json()
  return data
}
