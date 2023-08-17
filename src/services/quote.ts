import {request} from "@@/exports";
import {QuoteData} from "@/services/data";

export async function getQuote (
  params: {
    projectId: number;
  },
) {
  return request<QuoteData>('/action/quote/get', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    params:{
      ...params,
    },
  });
}

export async function updateQuote(values: Record<string, any>) {
  return request('/action/quote/addOrUpdate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: values,
  });
}
