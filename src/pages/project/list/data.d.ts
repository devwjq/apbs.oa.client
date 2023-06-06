import type React from "react";

type PaginationData = {
  total: number;
  pageSize: number;
  current: number;
};

export type ClientData = {
  id: React.Key;
  name?: string;
  client_type_id?: number;
  phone?: string;
  email?: string;
  company?: string;
  abn?: string;
  address?: string;
  update_time?: Date;
}

export type ProjectTypeData = {
  id: React.Key
  name: string
}

export type ProjectData = {
  id?: React.Key;
  type?: ProjectTypeData;
  client?: ClientData;
  name?: string;
  strata_plan?: string;
  address?: string;
  description?: string;
  note?: string;
  issue_date?: Date;
  due_date?: Date;
  progress?: number;
  status?: number;
  update_time?: Date;
  create_time?: Date;
}

type ContactData = {
  id: React.Key;
  role?: number;
  name?: string;
  phone?: string;
  email?: string;
}

type WorkerData = {
  id: React.Key;
  name: string;
  phone?: string;
  email?: string;
  company?: string;
}

type InspectionData = {
  inspection_id: React.Key;
  project_id: number;
  inspection_need: boolean;
  inspection_time: [];
  inspection_note: string;
  inspection_report: string;
}

type InspectorData = {
  id: React.Key;
  inspection?: InspectionData;
  worker?: WorkerData;
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
}

export type TableListParams = {
  status?: string;
  name?: string;
  desc?: string;
  key?: number;
  pageSize?: number;
  currentPage?: number;
  filter?: Record<string, any[]>;
  sorter?: Record<string, any>;
};
