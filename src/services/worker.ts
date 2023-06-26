import {request} from "umi";
import {WorkerData} from "@/services/data";


export async function queryWorkers (
  params: {
    current?: number; /** 当前的页码 */
    pageSize?: number;  /** 页面的容量 */
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: WorkerData[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/action/worker/query', {
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

export async function updateWorker(values: Record<string, any>) {
  return request('/action/worker/addOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: values,
  });
}

export async function deleteWorker (
  params: {
    id: number;
  },
) {
  return request('/action/worker/delete', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params:{
      ...params,
    },
  });
}
