import {DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Col, Popconfirm, Row} from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from "@ant-design/pro-table";
import {PaginationData, ClientData} from "@/services/data";
import {ModalForm, ProFormSelect, ProFormText} from "@ant-design/pro-form";
import {debug} from "@/pages/Env";
import {deleteClient, getClientTypes, queryClients, updateClient} from "@/services/client";

const WorkerList: React.FC = () => {
  const [clientEditModalVisible, handleClientEditModalVisible] = useState<boolean>(false);
  const listRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<ClientData>();

  const deleteConfirm = async (id: number) => {
    const success = await deleteClient({id: id});

    if (success && listRef.current) {
      listRef.current.reload();
    }
  }

  const clientListColumns: ProColumns<ClientData>[] = [
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
      title: 'Type',
      dataIndex: 'client_type_id',
      valueType: 'select',
      valueEnum: {
        1: {
          text: 'Strata',
        },
        2: {
          text: 'Owner',
        },
        3: {
          text: 'Tenant',
        },
      },
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
      title: 'Company',
      dataIndex: 'company',
      // hideInTable: true
    },
    {
      title: 'ABN',
      dataIndex: 'abn',
      // hideInTable: true
    },
    {
      title: 'Address',
      dataIndex: 'address',
      // hideInTable: true
    },
    {
      title: 'Action',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setCurrentRow(record);
            handleClientEditModalVisible(true);
          }}
        >
          <EditOutlined/>
        </a>,
        <Popconfirm
          key="deleteClientConfirm"
          title="Delete this client?"
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
    },
  ];

  return (
    <PageContainer>
      <ProTable<ClientData, PaginationData>
        headerTitle="List"
        actionRef={listRef}
        rowKey="id"
        search={{
          labelWidth: "auto",
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="clientAddButton"
            onClick={() => {
              setCurrentRow(undefined);
              handleClientEditModalVisible(true);
            }}
          >
            <PlusOutlined /> New
          </Button>,
        ]}
        columnsState={{
          defaultValue: { // 配置初始值；如果配置了持久化，仅第一次生效（没有缓存的第一次），后续都按缓存处理。
            company: {
              show: false,
            },
            abn: {
              show: false,
            },
            address: {
              show: false,
            },
          },
        }}
        request={queryClients}
        columns={clientListColumns}
      />

      <ModalForm
        title={"Client: " + ((currentRow && currentRow.name) ? currentRow.name : "New")}
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
        open={clientEditModalVisible}
        onOpenChange={handleClientEditModalVisible}
        onFinish={async (values?: ClientData) => {
          if(values) {
            const success = await updateClient(values)
            if (success && listRef.current) {
              handleClientEditModalVisible(false);
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
            <ProFormSelect
              label="Client Type"
              name="client_type_id"
              rules={[{required: true, message: 'Please choose client type'}]}
              request={async () => {
                const clientTypeData = await getClientTypes();
                const selectValues: any[] = [];
                clientTypeData.map((item: { name: string; id: number; }) => {
                  selectValues.push({
                    label: item.name,
                    value: item.id
                  });
                });
                return selectValues;
              }}
              initialValue={(currentRow && currentRow.client_type_id) ? currentRow.client_type_id : ""}
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
              name="email"
              label="Email"
              rules={[{required: false, type: "email", whitespace: false, message: 'Please input client email'}]}
              placeholder="Email"
              initialValue={(currentRow && currentRow.email) ? currentRow.email : ""}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              name="company"
              label="Company Name"
              placeholder="Company Name"
              initialValue={(currentRow && currentRow.company) ? currentRow.company : ""}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              label="Company ABN"
              name="abn"
              rules={[{required: false, message: 'Please input company ABN'},
                {pattern: /^\d{11}$/, message: 'Please input correct ABN number'}]}
              initialValue={(currentRow && currentRow.abn) ? currentRow.abn : ""}
            />
          </Col>
          <Col lg={12} md={24} sm={24}>
            <ProFormText
              label="Company Address"
              name="address"
              rules={[{required: false, message: 'Please input client address'}]}
              initialValue={(currentRow && currentRow.address) ? currentRow.address : ""}
            />
          </Col>
        </Row>
      </ModalForm>
    </PageContainer>
  );
};

export default WorkerList;
