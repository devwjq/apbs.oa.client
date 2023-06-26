import type {Dispatch, MutableRefObject, SetStateAction} from "react";
import React, { useRef, useState} from "react";
import type { ProFormInstance} from "@ant-design/pro-form";
import {
  DrawerForm,
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton
} from "@ant-design/pro-form";
import {
  updateProject,
  getClientTypes,
  getProjectTypes,
  queryClients,
  getProject, getProjectContacts
} from "@/pages/service";
import {Button, Card, Col, Form, message, Popconfirm, Row, Space} from "antd";
import styles from "@/pages/project/list/style.less";
import type { ProColumns} from "@ant-design/pro-table";
import ProTable, {EditableProTable} from "@ant-design/pro-table";
import {EditOutlined, RedoOutlined, SearchOutlined} from "@ant-design/icons";
import {ClientData, PaginationData, ContactData, ProjectData} from "@/pages/data";

type FormProps = {
  projectListRef: MutableRefObject<any>;
  visible: boolean;
  onVisibleChange: Dispatch<SetStateAction<boolean>>;
  projectId?: number;
};

const ProjectEditDrawer: React.FC<FormProps> = (props) => {
  const [clientSelectModelVisible, handleClilentSelectModelVisible] = useState<boolean>(false);
  const [selectedClient, setSelectedClient] = useState<ClientData>();
  const [clientDisable, setClientDisable] = useState<boolean>(false);
  const projectEditDrawerRef = useRef<ProFormInstance>();
  const [contactEditableForm] = Form.useForm();

  const refillClientConfirm = (e?: React.MouseEvent<HTMLElement>) => {
    projectEditDrawerRef.current?.setFieldValue(['client', 'id'], null);
    projectEditDrawerRef.current?.setFieldValue(['client', 'name'], null);
    projectEditDrawerRef.current?.setFieldValue(['client', 'type'], null);
    projectEditDrawerRef.current?.setFieldValue(['client', 'phone'], null);
    projectEditDrawerRef.current?.setFieldValue(['client', 'email'], null);
    projectEditDrawerRef.current?.setFieldValue(['client', 'company'], null);
    projectEditDrawerRef.current?.setFieldValue(['client', 'abn'], null);
    projectEditDrawerRef.current?.setFieldValue(['client', 'address'], null);
    setClientDisable(false);
  };

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
      width: '30%',
      valueType: 'select',
      // valueEnum: {
      //   10: {
      //     text: 'Strata Manager',
      //   },
      //   20: {
      //     text: 'Building Manager',
      //   },
      //   30: {
      //     text: 'Owner',
      //   },
      //   40: {
      //     text: 'Tenant',
      //   },
      //   50: {
      //     text: 'Neighbor',
      //   },
      //   99: {
      //     text: 'Others',
      //   },
      // },
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
      width: '25%',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: '25%',
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

  return(
    <>
      <DrawerForm<ProjectData>
        formRef={projectEditDrawerRef}
        title={"Project: " + props.projectId}
        width="100%"
        autoFocusFirstInput
        drawerProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: 'Submit',
            resetText: 'Cancel',
          },
        }}
        visible={props.visible}
        onVisibleChange={props.onVisibleChange}
        onFinish={async (values?: ProjectData) => {
          if(values) {
            const isClientDisabled = clientDisable;
            setClientDisable(false);
            const success = await updateProject(values);
            if (success) {
              props.onVisibleChange(false);
              if (props.projectListRef.current) {
                props.projectListRef.current.reload();
              }
            } else {
              setClientDisable(isClientDisabled);
            }
          }
        }}
        request={async () => {
          if(props.projectId) {
            setClientDisable(true);
            return await getProject({id: props.projectId});
          }
          const nullProject = {} as ProjectData
          return nullProject;
        }}
      >
        <Card title="Client" className={styles.card} bordered={true}
          extra={
            <Space size="middle">
              <Popconfirm
                title="Refill client information?"
                onConfirm={refillClientConfirm}
                okText="Yes"
                cancelText="No"
              >
                <Button
                  type="primary"
                  key="refillClient"
                >
                  <RedoOutlined /> Refill
                </Button>
              </Popconfirm>
              <Button
                type="primary"
                key="findClient"
                onClick={() => {
                  handleClilentSelectModelVisible(true);
                }}
              >
                <SearchOutlined /> Find
              </Button>
            </Space>
          }
        >
          <ProFormText
            name={['client', 'id']}
            hidden={false}
            fieldProps={{
              onChange: (e) => {
                console.log("client_id change to: " + e.target.value);
              },
            }}
          />

          <Row gutter={16}>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label="Client Name"
                name={['client', 'name']}
                disabled={clientDisable}
                rules={[{required: true, message: 'Please input client name'}]}
                placeholder="Please input client name"
                initialValue="Test Client"/>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <ProFormSelect
                label="Client Type"
                name={['client', 'client_type_id']}
                disabled={clientDisable}
                rules={[{required: true, message: 'Please choose client type'}]}
                // request={getClientTypes}
                request={async () => {
                  const clientTypeData = await getClientTypes();
                  const selectValues: any[] = [];
                  clientTypeData.map((item: { name: string; id: number; }) => {
                    const labelValue = {} as {
                      label: string,
                      value: number
                    };
                    labelValue.label = item.name;
                    labelValue.value = item.id;
                    selectValues.push(labelValue);
                  });
                  return selectValues;
                }}
                placeholder="Please choose client type"
                initialValue={1}/>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label="Phone"
                name={['client', 'phone']}
                disabled={clientDisable}
                rules={[{required: false, message: 'Please input client phone'},
                  {pattern: /^(0[1-9])\d{8}$/, message: 'Please input correct phone number'}]}
                placeholder="Please input client phone"
                initialValue="0123456789"/>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label="Email"
                name={['client', 'email']}
                disabled={clientDisable}
                rules={[{required: false, type: "email", whitespace: false, message: 'Please input client email'}]}
                placeholder="Please input client email"
                initialValue="TestClient@test.com"/>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label="Company Name"
                name={['client', 'company']}
                disabled={clientDisable}
                rules={[{required: false, message: 'Please input company name'}]}
                placeholder="Please input company name"
                initialValue="Test Company"/>
            </Col>
            <Col lg={6} md={12} sm={24}>
              <ProFormText
                label="Company ABN"
                name={['client', 'abn']}
                disabled={clientDisable}
                rules={[{required: false, message: 'Please input company ABN'},
                  {pattern: /^\d{11}$/, message: 'Please input correct ABN number'}]}
                placeholder="Please input company ABN"
                initialValue="12345678901"/>
            </Col>
            <Col lg={12} md={24} sm={24}>
              <ProFormText
                label="Company Address"
                name={['client', 'address']}
                disabled={clientDisable}
                rules={[{required: false, message: 'Please input client address'}]}
                placeholder="Please input client address"
                initialValue="Test Client Address"/>
            </Col>
          </Row>
        </Card>
        <Card title="Project Detail" className={styles.card} bordered={true} style={{marginTop: 20}}>
          <ProFormText
            name="id"
            hidden={false}
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
                    const labelValue = {} as {
                      label: string,
                      value: number
                    };
                    labelValue.label = item.name;
                    labelValue.value = item.id;
                    selectValues.push(labelValue);
                  });
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
            scroll={{
              x: 390,
            }}
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
      </DrawerForm>

      <ModalForm
        title="Choose Client"
        width="90%"
        modalProps={{
          destroyOnClose: true,
        }}
        submitter={{
          searchConfig: {
            submitText: 'Select',
            resetText: 'Cancel',
          },
        }}
        visible={clientSelectModelVisible}
        onVisibleChange={handleClilentSelectModelVisible}
        // formRef?.current?.setFieldsValue({
        //                                    title: value,
        //                                    number: 800,
        //                                  })
        onFinish={async(values) => {
          if(selectedClient) {
            projectEditDrawerRef.current?.setFieldValue(['client', 'id'], selectedClient.id);
            projectEditDrawerRef.current?.setFieldValue(['client', 'name'], selectedClient.name);
            projectEditDrawerRef.current?.setFieldValue(['client', 'type'], selectedClient.client_type_id);
            projectEditDrawerRef.current?.setFieldValue(['client', 'phone'], selectedClient.phone);
            projectEditDrawerRef.current?.setFieldValue(['client', 'email'], selectedClient.email);
            projectEditDrawerRef.current?.setFieldValue(['client', 'company'], selectedClient.company);
            projectEditDrawerRef.current?.setFieldValue(['client', 'abn'], selectedClient.abn);
            projectEditDrawerRef.current?.setFieldValue(['client', 'address'], selectedClient.address);
            setClientDisable(true);
          }

          handleClilentSelectModelVisible(false);
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
                  setSelectedClient(selectedRows[0]);
                },
              }}
              request={queryClients}
              columns={clientListColumns}/>
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}

export default ProjectEditDrawer;
