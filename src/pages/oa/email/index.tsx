import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Col, Popconfirm, Row} from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from "@ant-design/pro-table";
import {PaginationData, ClientData, EmailData, ProjectData} from "@/services/data";
import {ModalForm, ProFormSelect, ProFormText} from "@ant-design/pro-form";
import {debug} from "@/pages/Env";
import {queryEmails} from "@/services/email";
import {getProject} from "@/services/project";

const EmailList: React.FC = () => {
  const listRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<ClientData>();

  const emailListColumns: ProColumns<EmailData>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: 'Title',
      dataIndex: 'title',
    },
    {
      title: 'Sender',
      dataIndex: 'from',
    },
    {
      title: 'Time',
      dataIndex: 'time',
      hideInSearch: true,
    },
    {
      title: 'Action',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="create"
          onClick={() => {
            setCurrentRow(record);
            // handleClientEditModalVisible(true);
          }}
        >
          <PlusOutlined />
        </a>,
      ]
    },
  ];

  return (
    <PageContainer>
      <ProTable<EmailData, PaginationData>
        headerTitle="List"
        actionRef={listRef}
        rowKey="id"
        search={{
          labelWidth: "auto",
        }}
        request={async () => {
          const emails = await queryEmails({current: 0, pageSize: 20});
          const nullProject = {} as ProjectData;
          return nullProject;
        }}
        columns={emailListColumns}
      />
    </PageContainer>
  );
};

export default EmailList;
