import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Col, Popconfirm, Row} from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from "@ant-design/pro-table";
import {PaginationData, WorkerData} from "@/services/data";
import {ModalForm, ProFormText} from "@ant-design/pro-form";
import {deleteWorker, queryWorkers, updateWorker} from "@/services/worker";
import {debug} from "@/pages/Env";

const WorkerList: React.FC = () => {
  const [workerEditModalVisible, handleWorkerEditModalVisible] = useState<boolean>(false);
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
      title: 'User ID',
      dataIndex: 'user_id',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      sorter: true,
    },
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Company',
      dataIndex: 'company',
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
      render: (_, record) => {
        return record.user_id ? "" : [
          <a
            key="edit"
            onClick={() => {
              setCurrentRow(record);
              handleWorkerEditModalVisible(true);
            }}
          >
            <EditOutlined/>
          </a>,
          <Popconfirm
            key="deleteWorkerConfirm"
            title="Delete this worker?"
            onConfirm={(e) => {
              setCurrentRow(record);
              deleteConfirm(Number(record.id));
            }}
            okText="Yes"
            cancelText="No"
          >
            <a>
              <DeleteOutlined/>
            </a>
          </Popconfirm>,
        ]
      }
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
            key="workerAddButton"
            onClick={() => {
              setCurrentRow(undefined);
              handleWorkerEditModalVisible(true);
            }}
          >
            <PlusOutlined /> New
          </Button>,
        ]}
        // columnsState={{
        //   defaultValue: { // 配置初始值；如果配置了持久化，仅第一次生效（没有缓存的第一次），后续都按缓存处理。
        //     id: {
        //       show: false,
        //     },
        //   },
        // }}
        request={queryWorkers}
        columns={workerListColumns}
      />

      <ModalForm
        title={"Worker: " + ((currentRow && currentRow.name) ? currentRow.name : "New")}
        autoFocusFirstInput
        modalProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: 'Save',
            resetText: 'Cancel',
          },
        }}
        open={workerEditModalVisible}
        onOpenChange={handleWorkerEditModalVisible}
        onFinish={async (values?: WorkerData) => {
          if(values) {
            const success = await updateWorker(values)
            if (success && listRef.current) {
              handleWorkerEditModalVisible(false);
              listRef.current.reload();
            }
          }
        }}
      >
        <ProFormText
          name="id"
          hidden={!debug}
          initialValue={(currentRow && currentRow.id) ? currentRow.id : ""}
        />
        <Row gutter={16}>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              name="name"
              label="Name"
              rules={[{required: true, message: 'Please input worker name'}]}
              placeholder="Worker Name"
              initialValue={(currentRow && currentRow.name) ? currentRow.name : ""}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              name="phone"
              label="Phone"
              rules={[{required: true, message: 'Please input phone number'},
                {pattern: /^(0[1-9])\d{8}$/, message: 'Please input correct phone number'}]}
              placeholder="Phone Number"
              initialValue={(currentRow && currentRow.phone) ? currentRow.phone : ""}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              name="company"
              label="Company"
              placeholder="Company Name"
              initialValue={(currentRow && currentRow.company) ? currentRow.company : ""}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              name="email"
              label="Email"
              rules={[{required: false, type: "email", whitespace: false, message: 'Please input client email'}]}
              placeholder="Email"
              initialValue={(currentRow && currentRow.email) ? currentRow.email : ""}
            />
          </Col>
        </Row>
      </ModalForm>
    </PageContainer>
  );
};

export default WorkerList;
