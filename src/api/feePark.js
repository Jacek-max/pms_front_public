import http from '@/utils/http'

export async function getListApi(parm) {
    return await http.get("/api/feePark/list", parm);
}

//查询车位列表
export async function getListNoPageApi() {
    return await http.get("/api/parkList/listNoPage", null);
}

export async function addApi(parm) {
    return await http.post("/api/feePark", parm);
}

export async function editApi(parm) {
    return await http.put("/api/feePark", parm);
}

export async function deleteApi(parm) {
    return await http.delete("/api/feePark", parm);
}

export async function payApi(parm) {
    return await http.post("/api/feePark/pay", parm);
}