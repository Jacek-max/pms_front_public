import http from '@/utils/http'

export async function getListApi(parm) {
    return await http.get("/api/houseUnit/list", parm)
}

export async function addApi(parm) {
    return await http.post("/api/houseUnit", parm)
}

//获取栋数列表
export async function unitListApi() {
    return await http.get("/api/HouseBuilding/unitList")
}

export async function editApi(parm) {
    return await http.put("/api/houseUnit", parm)
}

export async function deleteApi(parm) {
    return await http.delete("/api/houseUnit", parm)
}
