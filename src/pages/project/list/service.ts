// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import {
  ClientData,
  ContactData,
  InspectionData,
  InspectorData,
  ProjectData,
  WorkerData
} from "@/pages/project/list/data";

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

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: ProjectData[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ProjectData>('/api/rule', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<ProjectData>('/api/rule', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

