/**
 * The PUT request method for changes to be sent to GitLab.
 *
 * @param {url} url The URL with query params.
 */
export async function putRequest (url) {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    })
    if (!response.ok) {
      throw new Error(`Gitlab API request failed with status ${response.status}`)
    }
  } catch (err) {
    console.error('Fetch PUT method failed: ', err)
  }
}

/**
 * The DELETE request method for changes to be sent to GitLab.
 *
 * @param {url} url The URL with query params.
 */
export async function deleteRequest (url) {
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN}`
      }
    })
    if (!response.ok) {
      throw new Error(`Gitlab API request failed with status ${response.status}`)
    }
  } catch (err) {
    console.error('Fetch PUT method failed: ', err)
  }
}
