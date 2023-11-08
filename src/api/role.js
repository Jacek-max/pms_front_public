import http from '@/utils/http'

export async function getRoleListApi(parm){
    return await http.get("/api/role/list",parm)
}

export async function addRoleApi(parm){
    return await http.post("/api/role",parm)
}

export async function editRoleApi(parm){
    return await http.put("/api/role",parm)
}

export async function deleteRoleApi(parm){
    return await http.delete("/api/role",parm)
}

export async function getAssignTreeApi(parm){
    return await http.get("/api/role/getAssignTree",parm)
}

export async function assignSaveApi(parm){
    return await http.post("/api/role/saveAssign",parm)
}