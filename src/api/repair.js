import http from '@/utils/http'

export async function getMyListApi(parm) {
    return await http.get("/api/userRepair/myList", parm);
}

export async function getList(parm) {
    return await http.get("/api/userRepair/list", parm);
}

export async function addApi(parm) {
    return await http.post("/api/userRepair", parm);
}

export async function editApi(parm) {
    return await http.put("/api/userRepair", parm);
}

export async function deleteApi(parm) {
    return await http.delete("/api/userRepair", parm);
}

export async function getRepairApi(parm) {
    return await http.get("/api/userRepair/list", parm);
}

export async function dispatchApi(parm){
    return await http.post("/api/userRepair/dispatch",parm);
}