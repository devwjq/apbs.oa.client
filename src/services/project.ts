import {request} from "umi";
import {ContactData, ProjectData} from "@/services/data";


export async function getProjectTypes() {
  return request('/action/project/getTypes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

export async function getProjectContacts(
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
  }>('/action/project/getContacts', {
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

export async function queryProjects (
  params: {
    current?: number; /** 当前的页码 */
    pageSize?: number;  /** 页面的容量 */
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: ProjectData[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/action/project/query', {
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

export async function getProject (
  params: {
    id: number;
  },
) {
  return request<ProjectData>('/action/project/get', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params:{
      ...params,
    },
  });
}

export async function updateProject(values: Record<string, any>) {
  return request('/action/project/addOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: values,
  });
}

export async function deleteProject (
  params: {
    id: number;
  },
) {
  return request('/action/project/delete', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params:{
      ...params,
    },
  });
}
