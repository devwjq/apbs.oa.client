import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Popconfirm} from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from "@ant-design/pro-table";
import {PaginationData, WorkerData} from "@/pages/data";
import {deleteWorker, queryWorkers} from "@/pages/service";

const WorkerList: React.FC = () => {
  const [workerEditDrawerVisible, handleWorkerEditDrawerVisible] = useState<boolean>(false);
  const listRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<WorkerData>();

  const deleteConfirm = async (id: number) => {
    const success = await deleteWorker({id: id});

    if (success && listRef.current) {
      listRef.current.reload();
    }
  }

  const workerListColumns: ProColumns<WorkerData>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch:true,
      sorter: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Company',
      dataIndex: 'company',
      hideInForm: true,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Action',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            handleWorkerEditDrawerVisible(true);
          }}
        >
          <EditOutlined />
        </a>,
        <Popconfirm
          key="deleteWorkerConfirm"
          title="Delete this worker?"
          onConfirm={(e)=>{
            setCurrentRow(record);
            deleteConfirm(Number(record.id));
          }}
          okText="Yes"
          cancelText="No"
        >
          <a>
            <DeleteOutlined />
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<WorkerData, PaginationData>
        headerTitle="List"
        actionRef={listRef}
        rowKey="id"
        search={{
          labelWidth: "auto",
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="projectAddButton"
            onClick={() => {
              setCurrentRow(undefined);
              // handleProjectEditDrawerVisible(true);
              handleWorkerEditDrawerVisible(true);
            }}
          >
            <PlusOutlined /> New
          </Button>,
        ]}
        columnsState={{
          defaultValue: { // 配置初始值；如果配置了持久化，仅第一次生效（没有缓存的第一次），后续都按缓存处理。
            id: {
              show: false,
            },
            address: {
              show: false,
            },
            issue_date: {
              show: false,
            },
          },
        }}
        // scroll={{
        //   x: 980,
        // }}
        request={queryWorkers}
        columns={workerListColumns}
      />

      {/*<ProjectManageDrawer*/}
      {/*  projectData={currentRow}*/}
      {/*  projectListRef={listRef}*/}
      {/*  visible={projectManageDrawerVisible}*/}
      {/*  onVisibleChange={handleProjectManageDrawerVisible}*/}
      {/*/>*/}
    </PageContainer>
  );
};

export default WorkerList;
