import http from '@/utils/http'

export async function getListApi(parm){
    return await http.get("/api/parkList/list",parm);
}

export async function addApi(parm){
    return await http.post("/api/parkList",parm);
}

export async function editApi(parm){
    return await http.put("/api/parkList",parm);
}

export async function deleteApi(parm){
    return await http.delete("/api/parkList",parm);
}