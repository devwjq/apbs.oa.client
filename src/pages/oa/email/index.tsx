import { EmailData, PaginationData } from '@/services/data';
import { queryGmails } from '@/services/email';
import { ScheduleOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React, { useRef, useState } from 'react';

const EmailList: React.FC = () => {
  const listRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<EmailData>();

  const emailListColumns: ProColumns<EmailData>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'Sender',
      dataIndex: 'from',
      ellipsis: true,
      width: 200,
      render: (_, record) => <b>{_}</b>,
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      render: (_, record) => (
        <div>
          <div>
            <b>{_}</b>
          </div>
          <div>{record.snippet ? record.snippet : ''}</div>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      hideInSearch: true,
      align: 'right',
      width: 100,
      render: (_, record) => <b>{_}</b>,
    },
    {
      title: 'Action',
      valueType: 'option',
      align: 'center',
      width: 60,
      render: (_, record) => [
        <a
          key="create"
          onClick={() => {
            setCurrentRow(record);
            // handleClientEditModalVisible(true);
          }}
        >
          <ScheduleOutlined />
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<EmailData, PaginationData>
        headerTitle="List"
        actionRef={listRef}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={false}
        request={async (params, sort, filter) => {
          const response = await queryGmails(params);
          if (response.oauthUrl) {
            console.log('oauthUrl = ' + response.oauthUrl);
            window.location.href = response.oauthUrl;
          }

          return response;
        }}
        columns={emailListColumns}
      />
    </PageContainer>
  );
};

export default EmailList;
