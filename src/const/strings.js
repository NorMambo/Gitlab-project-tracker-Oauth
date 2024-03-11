export const strings = {
  MSG_404: 'File does not exist',
  MSG_401: 'Not authorized',
  MSG_403: 'Access forbidden',
  MSG_500: 'Oooops an error occurred...',
  MSG_ACCESS_GRANTED: 'You have been granted access!',
  MSG_LOGOUT: 'Logged out successfully!',
  MSG_SELECT_PROJECT: 'Select a project with the correspondent project ID',
  MSG_NONEXISTENT_PROJECT: 'Project does not exist',
  MSG_EXISTENT_HOOK: 'Project already has a webhook',
  MSG_NEED_NEW_HOOK: 'Project needs a webhook',
  MSG_FETCH_ISSUE_ERR: 'Error fetching issues',
  MSG_API_REQ_ERR: 'Gitlab API request failed with status:'
}

export const urls = {
  WEBHOOK_ENDPOINT: 'https://cscloud6-120.lnu.se/assignment/webhook/gitlab-issue-data.json',
  API_URL: 'https://gitlab.lnu.se/api/v4/projects',
  AUTH_TOKEN_URL: 'https://gitlab.lnu.se/oauth/token',
  GITLAB_API_PROJ_URL: 'https://gitlab.lnu.se/api/v4/projects',
  LABEL_QUERY: '?with_labels_details=true',
  COMMENTS_QUERY: '?white_notes=true',
  GITLAB_IP: '194.47.176.14',
  GITLAB_DOMAIN: 'https://gitlab.lnu.se/',
  REDIRECT_URL_OAUTH: 'https://cscloud6-120.lnu.se/assignment/access/callback'
}

export const ids = {
  APP_ID: '379975a3bc0cab8a751b8c92b9100e602e3282f24e5d2f8bc79cf878a08b4ff2'
}
