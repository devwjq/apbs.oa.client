import ReactQuillEditor from '@/components/ReactQuillEditor';
import { debug } from '@/pages/Env';
import styles from '@/pages/oa/project/style.less';
import { ContactData, InspectorData, PaginationData, WorkerData } from '@/services/data';
import { getInspectionContacts, getInspectors } from '@/services/inspection';
import { queryWorkers } from '@/services/worker';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ModalForm,
  ProFormDateTimeRangePicker,
  ProFormSwitch,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import {Button, Card, Col, Form, Popconfirm, Row} from 'antd';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import React, {useState} from 'react';
import {FormInstance} from "antd/lib";

type FormProps = {
  projectId?: number;
  setStepForm: (step: number, form: FormInstance) => void;
  inspectorDataSource: InspectorData[];
  setInspectorDataSource: Dispatch<SetStateAction<InspectorData[]>>;
};

const InspectionStepForm: React.FC<FormProps> = (props) => {
  const [inspectorChooseModelVisible, handleInspectorChooseModelVisible] = useState<boolean>(false);
  const [chosenInspectors, setChosenInspectors] = useState<InspectorData[]>();

  const form = Form.useFormInstance();
  props.setStepForm(1, form);
  form.setFieldValue("project_id", props.projectId);

  let need = Form.useWatch('inspection_need', form);
  if(need == undefined) {
    need = true;
  }

  const workerListColumns: ProColumns<WorkerData>[] = [
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
  ];

  const inspectorListColumns: ProColumns<InspectorData>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
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
          <Popconfirm
            key="inspectorDeleteConfirm"
            title="Delete this inspector?"
            onConfirm={(e) => {
              const inspectorData = [] as InspectorData[];
              let i = 0;
              props.inspectorDataSource.forEach(function (inspector) {
                if (inspector.id !== Number(record.id)) {
                  inspectorData[i] = {
                    id: inspector.id,
                    name: inspector.name,
                    phone: inspector.phone,
                    email: inspector.email,
                    company: inspector.company,
                  };
                  i++;
                }
              });
              props.setInspectorDataSource(inspectorData);
            }}
            okText="Yes"
            cancelText="No"
          >
            <a>
              <DeleteOutlined />
            </a>
          </Popconfirm>,
        ];
      },
    },
  ];

  // let inspectorDataSource: InspectorData[] = [{id: -1, name: "test", phone: "0400000000"}];

  const accessContactListColumns: ProColumns<ContactData>[] = [
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

  return (
    <>
      <Card title="Arrangement" className={styles.card} bordered={true}>
        <ProFormText name="inspection_id" hidden={!debug} disabled={true} fieldProps={{addonBefore: "Inspection ID"}}/>
        <ProFormText name="project_id" hidden={!debug} initialValue={props.projectId} disabled={true} fieldProps={{addonBefore: "Project ID"}}/>
        {/*<ProFormText*/}
        {/*  name="need_inspection"*/}
        {/*  hidden={!debug}*/}
        {/*  disabled={inspectionDisable}*/}
        {/*  initialValue={true}/>*/}

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <ProFormSwitch
              name="inspection_need"
              label="Need inspection? "
              fieldProps={{
                checkedChildren: 'Yes',
                unCheckedChildren: 'No',
                defaultChecked: true,
              }}
            />
          </Col>
          {need ? (
            <>
              <Col lg={12} md={12} sm={24}>
                <ProFormDateTimeRangePicker
                  name="inspection_time"
                  label="Inspection Time"
                  fieldProps={{
                    format: 'YYYY-MM-DD HH:mm',
                  }}
                  rules={[{ required: true }]}
                />
              </Col>
              <Col span={24}>
                <ProFormTextArea
                  fieldProps={{ autoSize: { minRows: 3, maxRows: 5 } }}
                  label="Note"
                  name="inspection_note"
                  rules={[{ required: false, message: 'Please input inspection note' }]}
                  placeholder="Please input inspection note"
                  initialValue="Test Note"
                />
              </Col>

              <Col span={24}>
                <ProFormText
                  name="inspectors"
                  hidden={!debug}
                  initialValue={props.inspectorDataSource}
                />
                <ProTable<InspectorData>
                  headerTitle="Inspectors"
                  name="inspector_list"
                  rowKey="id"
                  search={false}
                  pagination={false}
                  toolBarRender={() => [
                    <Button
                      type="primary"
                      key="inspectorAddButton"
                      onClick={() => {
                        handleInspectorChooseModelVisible(true);
                      }}
                    >
                      <PlusOutlined /> Add
                    </Button>,
                  ]}
                  columns={inspectorListColumns}
                  dataSource={props.inspectorDataSource}
                  request={async () => {
                    if (
                      (!props.inspectorDataSource || props.inspectorDataSource.length === 0) &&
                      props.projectId
                    ) {
                      const serverData = await getInspectors({ id: props.projectId });
                      props.setInspectorDataSource(serverData.data);
                    }
                    return { success: true };
                  }}
                />
              </Col>

              <Col span={24} style={{ marginTop: 20 }}>
                <EditableProTable<ContactData>
                  headerTitle="Access Contacts"
                  name="inspection_contacts"
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
                  columns={accessContactListColumns}
                  // value={contactData}
                  // onChange={setContactData}
                  request={async () => {
                    if (props.projectId) {
                      return await getInspectionContacts({ id: props.projectId });
                    }
                    return { success: false };
                  }}
                  editable={{
                    type: 'multiple',
                    //   form: contactEditableForm,
                    actionRender: (row, config, defaultDoms) => {
                      // return [defaultDoms.save, defaultDoms.delete, defaultDoms.cancel];
                      return [defaultDoms.delete];
                    },
                    //   // onCancel: async (key, row, originRow, newLinew) => {
                    //   //   contactEditableForm.resetFields([key]);
                    //   // },
                  }}
                />
              </Col>
            </>
          ) : null }
        </Row>
      </Card>

      { need ? (
        <Card
          title="Report"
          className={styles.card}
          bordered={true}
          style={{ marginTop: 20, paddingBottom: 40 }}
        >
          <Row gutter={16}>
            <Col span={24}>
              <ReactQuillEditor
                name="inspection_report"
                rules={[{ required: false, message: 'Please input inspection report.' }]}
              />
              {/*<ReactQuillWithTableEditor/>*/}
            </Col>
          </Row>
        </Card>
      ) : null }

      <ModalForm
        title="Choose Inspector"
        width="90%"
        // modalProps={{
        //   destroyOnClose: true,
        // }}
        submitter={{
          searchConfig: {
            submitText: 'Choose',
            resetText: 'Cancel',
          },
        }}
        open={inspectorChooseModelVisible}
        onOpenChange={handleInspectorChooseModelVisible}
        onFinish={async (values) => {
          if (chosenInspectors && chosenInspectors.length > 0) {
            const inspectorData = JSON.parse(JSON.stringify(props.inspectorDataSource)); //深度copy数组
            let i = 0;
            chosenInspectors.forEach(function (chosenInspector) {
              let isExist = false;
              props.inspectorDataSource.forEach(function (dsInspector) {
                if (dsInspector.id === chosenInspector.id) {
                  isExist = true;
                }
              });

              if (!isExist) {
                inspectorData[props.inspectorDataSource.length + i] = {
                  id: chosenInspector.id,
                  name: chosenInspector.name,
                  phone: chosenInspector.phone,
                  email: chosenInspector.email,
                  company: chosenInspector.company,
                };
                i++;
              }
            });
            props.setInspectorDataSource(inspectorData);
          }
          handleInspectorChooseModelVisible(false);
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <ProTable<WorkerData, PaginationData>
              headerTitle="Result"
              rowKey="id"
              search={{
                labelWidth: 'auto',
                filterType: 'query',
              }}
              tableAlertRender={false}
              rowSelection={{
                // type: "radio",
                onChange: (_, selectedRows) => {
                  setChosenInspectors(selectedRows);
                },
              }}
              request={queryWorkers}
              columns={workerListColumns}
              pagination={{
                pageSize: 8,
              }}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default InspectionStepForm;
