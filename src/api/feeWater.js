import http from '@/utils/http'

//根据单元Id查询房屋列表
export async function getHouseByUnitIdApi(parm) {
    return await http.get("/api/houseList/getHouseByUnitId", parm);
}

export async function getListApi(parm) {
    return await http.get("/api/feeWater/list", parm);
}

export async function addApi(parm) {
    return await http.post("/api/feeWater", parm);
}

export async function editApi(parm) {
    return await http.put("/api/feeWater", parm);
}

export async function deleteApi(parm) {
    return await http.delete("/api/feeWater", parm);
}

export async function payApi(parm) {
    return await http.post("/api/feeWater/payWater", parm);
}