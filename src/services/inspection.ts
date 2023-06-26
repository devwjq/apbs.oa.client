import {request} from "@@/exports";
import {ContactData, InspectionData, InspectorData} from "@/services/data";

export async function getInspection (
  params: {
    projectId: number;
  },
) {
  return request<InspectionData>('/action/inspection/get', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params:{
      ...params,
    },
  });
}

export async function updateInspection(values: Record<string, any>) {
  return request('/action/inspection/addOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: values,
  });
}

export async function getInspectors(
  params: {
    current?: number; /** 当前的页码 */
    pageSize?: number;  /** 页面的容量 */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: InspectorData[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/action/inspection/getInspectors', {
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

export async function getInspectionContacts(
  params: {
    current?: number; /** 当前的页码 */
    pageSize?: number;  /** 页面的容量 */
    id: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: ContactData[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/action/inspection/getContacts', {
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
