export function buildRequest(endpoint, query, data, headers, onUploadConfig) {
  const condition =
    typeof endpoint.method === 'undefined' ||
    typeof endpoint.url === 'undefined'
  if (condition) {
    return null
  }
  const baseURL = process.env.VUE_APP_BASE_URL
  const request = {
    method: endpoint.method,
    url: baseURL + endpoint.url
  }
  if (typeof query !== 'undefined') {
    request.url += query
  }
  if (typeof data !== 'undefined') {
    request.data = data
  }
  if (typeof headers !== 'undefined') {
    request.headers = headers
  }
  if (typeof onUploadConfig !== 'undefined') {
    request.onUploadProgress = onUploadConfig
  }
  return request
}
