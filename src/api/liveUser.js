import http from '@/utils/http'

export async function addApi(parm) {
    return await http.post("/api/liveUser", parm);
}

//获取角色列表
export async function getRoleListApi() {
    return await http.get("/api/role/getList", null);
}

//业主列表获取
export async function getListApi(parm) {
    return await http.get("/api/liveUser/list", parm);
}

//根据Id查询用户
export async function getUserById(parm) {
    return await http.get("/api/liveUser/getUserById", parm);
}

export async function editApi(parm) {
    return await http.put("/api/liveUser", parm)
}

export async function deleteApi(parm) {
    return await http.delete("/api/liveUser", parm)
}

//获取房屋列表
export async function getHouseListApi(parm) {
    return await http.get("/api/houseList/list", parm);
}

//分配房屋保存
export async function assignSavaApi(parm) {
    return await http.post("/api/liveUser/assignSava", parm);
}

//获取车位列表
export async function getParkListApi(parm) {
    return await http.get("/api/parkList/list", parm);
}

//分配车位保存
export async function assignParkSavaApi(parm) {
    return await http.post("/api/liveUser/assignParkSava", parm);
}

//退房
export async function returnHouseApi(parm) {
    return await http.post("/api/liveUser/returnHouse", parm);
}

export async function returnParkApi(parm) {
    return await http.post("/api/liveUser/returnPark", parm);
}