import {request} from "umi";
import {ClientData} from "@/services/data";


export async function getClientTypes() {
  return request('/action/client/getTypes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function queryClients (
  params: {
    current?: number; /** 当前的页码 */
    pageSize?: number;  /** 页面的容量 */
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: ClientData[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/action/client/query', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params: {
      ...params,
    },
    ...(options || {}),
  });
}
