import http from '@/utils/http'

//根据单元Id查询房屋列表
export async function getHouseByUnitIdApi(parm) {
    return await http.get("/api/houseList/getHouseByUnitId", parm);
}

export async function addPowerApi(parm) {
    return await http.post("/api/feePower", parm);
}

export async function getListApi(parm) {
    return await http.get("/api/feePower/list", parm);
}

export async function editPowerApi(parm) {
    return await http.put("/api/feePower", parm);
}

export async function deletePowerApi(parm) {
    return await http.delete("/api/feePower", parm);
}

//缴费
export async function payPowerApi(parm){
    return await http.post("/api/feePower/payPower",parm);
}