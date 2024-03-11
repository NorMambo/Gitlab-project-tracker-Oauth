import { strings, urls } from '../const/strings.js'

/**
 * Restricts the routes by checking if a user has a session (check the routes to see where it's used).
 *
 * @param {object} req The request.
 * @param {object} res The response.
 * @param {Function} next Lets the next function/middleware run.
 */
export function isLoggedIn (req, res, next) {
  if (req.session.enabled && req.session.enabled === true) {
    next()
  } else {
    res.status(401).send(strings.MSG_401)
  }
}

/**
 * Checks if the access token is set to undefined.
 *
 * @param {object} req The request.
 * @param {object} res The response.
 * @param {Function} next Lets the next function/middleware run.
 */
export function noToken (req, res, next) {
  if (req.session.access_token === undefined) {
    next()
  } else {
    res.render('partials/home', { layout: 'index', enabled: req.session.enabled })
  }
}

/**
 * Restricts the routes to gitlab only (check the routes to see where it's used).
 *
 * @param {object} req The request.
 * @param {object} res The response.
 * @param {Function} next Lets the next function/middleware run.
 */
export function restrictToGitlab (req, res, next) {
  const requestingIP = req.headers['x-forwarded-for']
  const referer = req.get('referer')
  if (referer === urls.GITLAB_DOMAIN || requestingIP === urls.GITLAB_IP) {
    next()
  } else {
    res.status(403).send(strings.MSG_403)
  }
}

/**
 * Check if a project (with the same project ID as the request) exists. Used as middleware.
 *
 * @param {object} req The request.
 * @param {object} res The response.
 * @param {Function} next Lets the next function/middleware run.
 */
export async function projectExists (req, res, next) {
  const projectID = req.body.proj_id
  const token = req.session.access_token
  const response = await fetch(`${urls.API_URL}/${projectID}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  if (!response.ok) {
    if (response.status === 404) {
      req.session.flashmessage = strings.MSG_NONEXISTENT_PROJECT
      res.render('partials/selectProject', { layout: 'index', enabled: req.session.enabled, flashmessage: req.session.flashmessage })
    } else {
      throw new Error(`${strings.MSG_API_REQ_ERR} ${response.status}`)
    }
  } else {
    next()
  }
}
