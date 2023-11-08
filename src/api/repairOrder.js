import http from '@/utils/http'

export async function getOrderListApi(parm) {
    return await http.get("/api/dispatchOrder/getOrderList", parm);
}