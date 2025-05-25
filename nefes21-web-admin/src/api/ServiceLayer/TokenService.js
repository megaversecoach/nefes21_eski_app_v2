const TOKEN_KEY = 'access_token'

const TokenService = {
  getToken() {
    return sessionStorage.getItem(TOKEN_KEY)
  },
  saveToken(token) {
    sessionStorage.setItem(TOKEN_KEY, token)
  },
  removeToken() {
    sessionStorage.removeItem(TOKEN_KEY)
  }
}
export { TokenService }
