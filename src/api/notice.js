import http from '@/utils/http'

export async function getListApi(parm) {
    return await http.get("/api/sysNotice/list", parm);
}

export async function addApi(parm) {
    return await http.post("/api/sysNotice", parm);
}

export async function editApi(parm) {
    return await http.put("/api/sysNotice", parm);
}

export async function deleteApi(parm) {
    return await http.delete("/api/sysNotice", parm);
}

export async function getNoticeApi(parm) {
    return await http.get("/api/sysNotice/list", parm);
}

export async function isTopApi(parm){
    return await http.get("/api/sysNotice/isTop",parm);
}

export async function getTopApi(){
    return await http.get("/api/sysNotice/getTop");
}