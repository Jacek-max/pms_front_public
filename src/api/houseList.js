import http from '@/utils/http'

export async function getListApi(parm){
    return await http.get("/api/houseList/list",parm);
}

export async function addApi(parm){
    return await http.post("/api/houseList",parm);
}

//查询栋数列表
export async function getBuildApi() {
    return await http.get("/api/HouseBuilding/unitList", null);
}

//根据栋数Id查询单元列表
export async function getUnitListByIdApi(parm){
    return await http.get("/api/houseUnit/getUnitListByBuildId",parm);
}

export async function editApi(parm){
    return await http.put("/api/houseList",parm);
}

export async function deleteApi(parm){
    return await http.delete("/api/houseList",parm);
}