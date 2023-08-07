import { EmailData } from '@/services/data';
import { request } from '@@/exports';

export async function queryGmails(
  params: {
    current?: number /** 当前的页码 */;
    pageSize?: number /** 页面的容量 */;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: EmailData[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
    oauthUrl?: string;
  }>('/action/google/gmail_query', {
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
