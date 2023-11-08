import http from '@/utils/http'

export async function getWaitingRepairApi() {
    return await http.get("/api/userRepair/getWaitingRepair", null);
}

export async function getWaitingComplaintApi() {
    return await http.get("/api/userComplaint/getWaitingComplaint", null);
}

export async function getHouseCountApi() {
    return await http.get("/api/houseList/getHouseCount", null);
}

export async function getParkCountApi() {
    return await http.get("/api/parkList/getParkCount", null);
}

// export async function getMyListApi(parm) {
//     return await http.get("/api/userComplaint/myList", parm);
// }

// export async function getMyRepairApi(parm) {
//     return await http.get("/api/userRepair/myList", parm);
// }

export async function getMyRepairNoApi(parm){
    return await http.get("/api/userRepair/getMyRepairNo",parm);
}

export async function getMyComplaintNoApi(parm){
    return await http.get("/api/userComplaint/getMyComplaintNo",parm);
}