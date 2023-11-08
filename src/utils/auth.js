import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

const userIdKey = 'userId';

export function setUserId(value){
  return Cookies.set(userIdKey,value)
}

export function getUserId(){
  return Cookies.get(userIdKey)
}

export function removeUserId(){
  return Cookies.remove(userIdKey)
}
//清空sessionStore
export function clearSession(){
  return sessionStorage.clear();
}