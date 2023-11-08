import http from '@/utils/http'

export async function getMyPowerFeeApi(parm) {
    return await http.get("/api/feePower/getMyPowerFee", parm);
}

export async function getMyWaterFeeApi(parm) {
    return await http.get("/api/feeWater/getMyWaterFee", parm);
}

export async function getMyParkFeeApi(parm) {
    return await http.get("/api/feePark/getMyParkFee", parm);
}