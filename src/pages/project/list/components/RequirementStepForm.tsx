import type {MutableRefObject} from "react";
import React, { useState} from "react";
import {
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  ModalForm,
} from "@ant-design/pro-form";
import {Button, Card, Col, Form, message, Row, Space} from "antd";
import styles from "@/pages/project/list/style.less";
import type { ProColumns} from "@ant-design/pro-table";
import ProTable, {EditableProTable} from "@ant-design/pro-table";
import {EditOutlined, SearchOutlined} from "@ant-design/icons";
import {ClientData, ContactData, PaginationData} from "@/services/data";
import {getClientTypes, queryClients} from "@/services/client";
import {getProjectContacts, getProjectTypes} from "@/services/project";

type FormProps = {
  projectId?: number;
  formRef: MutableRefObject<any>;
  // clientDisable: boolean;
  // setClientDisable: Dispatch<SetStateAction<boolean>>;
};

const RequirementStepForm: React.FC<FormProps> = (props) => {
  const debug = true;
  // const formRef = useRef<ProFormInstance>();
  const [contactEditableForm] = Form.useForm();
  // const [clientDisable, setClientDisable] = useState<boolean>(false);
  const [clientChooseModelVisible, handleClientChooseModelVisible] = useState<boolean>(false);
  const [chosenClient, setChosenClient] = useState<ClientData>();

  const clientListColumns: ProColumns<ClientData>[] = [
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
      hideInSearch: true,
    },
    {
      title: 'Company',
      dataIndex: 'company',
    },
    {
      title: 'ABN',
      dataIndex: 'abn',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      hideInTable: true,
      hideInSearch: true,
    },
    {
      title: 'Time',
      dataIndex: 'update_time',
      valueType: 'date',
      hideInTable: true,
      hideInSearch: true,
    },
  ];

  const contactListColumns: ProColumns<ContactData>[] = [
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      valueType: 'select',
      request: async () => [
        { value: 10, label: 'Strata Manager' },
        { value: 20, label: 'Building Manager' },
        { value: 30, label: 'Owner' },
        { value: 40, label: 'Tenant' },
        { value: 50, label: 'Neighbor' },
        { value: 99, label: 'Others' },
      ],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Action',
      key: 'action',
      valueType: 'option',
      render: (_, record: ContactData, index, action) => {
        return [
          <a
            key="contactEdit"
            onClick={() => {
              action?.startEditable(record.id);
            }}
          >
            <EditOutlined />
          </a>,
        ];
      },
    },
  ];

  // const refillClientConfirm = (e?: React.MouseEvent<HTMLElement>) => {
  //   props.formRef.current?.setFieldValue(['client', 'id'], null);
  //   props.formRef.current?.setFieldValue(['client', 'name'], null);
  //   props.formRef.current?.setFieldValue(['client', 'type'], null);
  //   props.formRef.current?.setFieldValue(['client', 'phone'], null);
  //   props.formRef.current?.setFieldValue(['client', 'email'], null);
  //   props.formRef.current?.setFieldValue(['client', 'company'], null);
  //   props.formRef.current?.setFieldValue(['client', 'abn'], null);
  //   props.formRef.current?.setFieldValue(['client', 'address'], null);
  //   props.setClientDisable(false);
  // };

  return(
    <>
      <Card title="Client" className={styles.card} bordered={true}
        extra={
          <Space size="middle">
            {/*<Popconfirm*/}
            {/*  title="Refill client information?"*/}
            {/*  onConfirm={refillClientConfirm}*/}
            {/*  okText="Yes"*/}
            {/*  cancelText="No"*/}
            {/*>*/}
            {/*  <Button*/}
            {/*    type="primary"*/}
            {/*    key="refillClient"*/}
            {/*  >*/}
            {/*    <RedoOutlined /> Refill*/}
            {/*  </Button>*/}
            {/*</Popconfirm>*/}
            <Button
              type="primary"
              key="findClient"
              onClick={() => {
                handleClientChooseModelVisible(true);
              }}
            >
              <SearchOutlined /> Find
            </Button>
          </Space>
        }
      >
        <ProFormText
          name={['client', 'id']}
          hidden={!debug}
          // rules={[{required: true, message: 'Please choose a client'}]}
          placeholder="Please choose a client"
        />

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="Client Name"
              name={['client', 'name']}
              // disabled={props.clientDisable}
              disabled={true}
              rules={[{required: true, message: 'Please input client name'}]}/>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label="Client Type"
              name={['client', 'client_type_id']}
              // disabled={props.clientDisable}
              disabled={true}
              rules={[{required: true, message: 'Please choose client type'}]}
              // request={getClientTypes}
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
              }}/>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="Phone"
              name={['client', 'phone']}
              // disabled={props.clientDisable}
              disabled={true}
              rules={[{required: false, message: 'Please input client phone'},
                {pattern: /^(0[1-9])\d{8}$/, message: 'Please input correct phone number'}]}/>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="Email"
              name={['client', 'email']}
              // disabled={props.clientDisable}
              disabled={true}
              rules={[{required: false, type: "email", whitespace: false, message: 'Please input client email'}]}/>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="Company Name"
              name={['client', 'company']}
              // disabled={props.clientDisable}
              disabled={true}
              rules={[{required: false, message: 'Please input company name'}]}/>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="Company ABN"
              name={['client', 'abn']}
              // disabled={props.clientDisable}
              disabled={true}
              rules={[{required: false, message: 'Please input company ABN'},
                {pattern: /^\d{11}$/, message: 'Please input correct ABN number'}]}/>
          </Col>
          <Col lg={12} md={24} sm={24}>
            <ProFormText
              label="Company Address"
              name={['client', 'address']}
              // disabled={props.clientDisable}
              disabled={true}
              rules={[{required: false, message: 'Please input client address'}]}/>
          </Col>
        </Row>
      </Card>
      <Card title="Project Detail" className={styles.card} bordered={true} style={{marginTop: 20}}>
        <ProFormText
          name="id"
          hidden={!debug}
          initialValue={props.projectId}/>
        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="Project Name"
              name="name"
              rules={[{required: true, message: 'Please input project name'}]}
              placeholder="Please input project name"
              initialValue="Test Project"/>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormSelect
              label="Project Type"
              name={['type', 'id']}
              rules={[{required: true, message: 'Please choose project type'}]}
              request={async () => {
                const projectTypeData = await getProjectTypes();
                const selectValues: any[] = [];
                projectTypeData.map((item: { name: string; id: number; }) => {
                  selectValues.push({
                    label: item.name,
                    value: item.id
                  });
                });
                console.log(selectValues);
                return selectValues;
              }}
              placeholder="Please choose project type"
              initialValue={3}/>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="Strata Plan"
              name="strata_plan"
              rules={[{required: false, message: 'Please input strata plan'}]}
              placeholder="Please input strata plan"
              initialValue="Test Strata Plan 12345"/>
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormDatePicker
              width="xl"
              label="Request Date"
              name="issue_date"
              rules={[{required: true, message: 'Please input work request date'}]}
              placeholder="Please input work request date"
              initialValue="2023-05-01"/>
          </Col>
          <Col span={24}>
            <ProFormText
              label="Worksite Address"
              name="address"
              rules={[{required: true, message: 'Please input worksite address'}]}
              placeholder="Please input worksite address"
              initialValue="Test Worksite Address"/>
          </Col>
          <Col span={24}>
            <ProFormTextArea
              fieldProps={{width: "100%", autoSize: {minRows: 5, maxRows: 10}}}
              label="Description"
              name="description"
              rules={[{required: true, message: 'Please input project description'}]}
              placeholder="Please input project description"
              initialValue="Test Description"/>
          </Col>
          <Col span={24}>
            <ProFormTextArea
              fieldProps={{autoSize: {minRows: 3, maxRows: 5}}}
              label="Note"
              name="note"
              rules={[{required: false, message: 'Please input project note'}]}
              placeholder="Please input project note"
              initialValue="Test Note"/>
          </Col>
        </Row>
      </Card>
      <Card title="Contacts" className={styles.card} bordered={true} style={{marginTop: 20}}>
        <EditableProTable<ContactData>
          name="contacts"
          rowKey="id"
          // scroll={{
          //   x: 390,
          // }}
          recordCreatorProps={{
            record: () => {
              return {
                id: `-${Date.now()}`,
              };
            },
            creatorButtonText: 'Add Contact',
          }}
          columns={contactListColumns}
          // value={contactData}
          // onChange={setContactData}
          request = {
            async () => {
              if(props.projectId) {
                return await getProjectContacts({id: props.projectId});
              }
              const nullContacts = {} as ContactData
              return nullContacts;
            }
          }
          editable={{
            type: 'multiple',
            form: contactEditableForm,
            actionRender: (row, config, defaultDoms) => {
              return [defaultDoms.save, defaultDoms.delete, defaultDoms.cancel];
            },
            // onCancel: async (key, row, originRow, newLinew) => {
            //   contactEditableForm.resetFields([key]);
            // },
          }}
        />
      </Card>
      <Card title="Files" className={styles.card} bordered={true} style={{marginTop: 20}}>
        <ProFormUploadButton
          name="uploads"
          fieldProps={{
            name: 'file',
            // listType: 'picture-card',
            onChange(info) {
              if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
              }

              if (info.file.status === 'removed') { //移除文件

              } else if (info.file.status === 'done') { //上传完成
                if (info.file.response.id > 0) { //上传成功
                  message.success(`${info.file.name} file uploaded successfully`);
                } else { //上传失败
                  message.error(info.file.response.Content ?? `${info.file.name} file uploaded failed`);
                }
              } else if (info.file.status === 'error') { //上传错误
                message.error(`${info.file.name} file upload failed.`);
              }
            },
          }}
          action="/action/upload/uploadFile/"/>
      </Card>

      <ModalForm
        title="Choose Client"
        width="90%"
        modalProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: 'Choose',
            resetText: 'Cancel',
          },
        }}
        visible={clientChooseModelVisible}
        onVisibleChange={handleClientChooseModelVisible}
        onFinish={async(values) => {
          if(chosenClient) {
            props.formRef.current?.setFieldValue(['client', 'id'], chosenClient.id);
            props.formRef.current?.setFieldValue(['client', 'name'], chosenClient.name);
            props.formRef.current?.setFieldValue(['client', 'type'], chosenClient.client_type_id);
            props.formRef.current?.setFieldValue(['client', 'phone'], chosenClient.phone);
            props.formRef.current?.setFieldValue(['client', 'email'], chosenClient.email);
            props.formRef.current?.setFieldValue(['client', 'company'], chosenClient.company);
            props.formRef.current?.setFieldValue(['client', 'abn'], chosenClient.abn);
            props.formRef.current?.setFieldValue(['client', 'address'], chosenClient.address);
            // props.setClientDisable(true);
          }

          handleClientChooseModelVisible(false);
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <ProTable<ClientData, PaginationData>
              headerTitle="Result"
              rowKey="id"
              search={{
                labelWidth: "auto",
                filterType: "query",
              }}
              columnsState={{
                defaultValue: { // 配置初始值；如果配置了持久化，仅第一次生效（没有缓存的第一次），后续都按缓存处理。
                  phone: {
                    show: false,
                  },
                  email: {
                    show: false,
                  },
                },
              }}
              tableAlertRender={false}
              rowSelection={{
                type: "radio",
                onChange: (_, selectedRows) => {
                  setChosenClient(selectedRows[0]);
                },
              }}
              request={queryClients}
              columns={clientListColumns}
              pagination={{
                pageSize: 8
              }}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}

export default RequirementStepForm;
