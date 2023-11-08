import http from '@/utils/http'

export async function getMenuListApi() {
    return await http.get("/api/menu/list")
}

export async function addMenuApi(parm) {
    return await http.post("/api/menu", parm)
}

export async function getParentTreeApi() {
    return await http.get("/api/menu/parent")
}

export async function editMenuApi(parm) {
    return await http.put("/api/menu", parm)
}

export async function deleteMenuApi(parm) {
    return await http.delete("/api/menu", parm)
}