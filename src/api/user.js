import http from '@/utils/http'
import {getUserId} from '@/utils/auth'

export async function getUserListApi(parm) {
  return await http.get("/api/user/list", parm)
}

export async function addUserApi(parm) {
  return await http.post("/api/user", parm)
}

export async function editUserApi(parm) {
  return await http.put("/api/user", parm);
}

export async function deleteUserApi(parm) {
  return await http.delete("/api/user", parm);
}

export async function login(parm) {
  console.log(parm);
  return await http.post("/api/user/login", parm);
}

//获取员工列表
export async function getSysUserListApi(){
  return await http.get("/api/user/getUserList");
}

//获取用户信息
export async function getInfo() {
  let parm = {
    userId: getUserId()
  }
  return await http.get("/api/user/getInfo", parm);
}

export async function getRoleByUserIdApi(parm) {
  return await http.get("/api/user/getRoleByUserId", parm);
}

export async function assignSaveApi(parm) {
  return await http.post("/api/user/saveRole", parm);
}

//获取菜单数据
export async function getMenuList() {
  return await http.get("/api/user/getMenuList", null);
}

// export function login(data) {
//   return request({
//     url: '/vue-admin-template/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo(token) {
//   return request({
//     url: '/vue-admin-template/user/info',
//     method: 'get',
//     params: { token }
//   })
// }

//退出登录
export async function loginOutApi() {
  return await http.post("/api/user/loginOut", null);
}

//修改密码
export async function resetPasswordApi(parm) {
  return await http.post("/api/user/resetPassword", parm);
}
// export function logout() {
//   return request({
//     url: '/vue-admin-template/user/logout',
//     method: 'post'
//   })
// }
