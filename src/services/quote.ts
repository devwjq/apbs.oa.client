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
