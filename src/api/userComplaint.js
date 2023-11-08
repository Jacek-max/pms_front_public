import http from '@/utils/http'

export async function getListApi(parm) {
    return await http.get("/api/userComplaint/list", parm);
}

export async function addApi(parm) {
    return await http.post("/api/userComplaint", parm);
}

export async function editApi(parm) {
    return await http.put("/api/userComplaint", parm);
}

export async function deleteApi(parm) {
    return await http.delete("/api/userComplaint", parm);
}

//我的投诉
export async function getMyListApi(parm) {
    return await http.get("/api/userComplaint/myList", parm);
}

export async function getComplaintApi(parm) {
    return await http.get("/api/userComplaint/list", parm);
}