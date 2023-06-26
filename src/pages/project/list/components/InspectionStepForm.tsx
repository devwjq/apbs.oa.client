import type {Dispatch, MutableRefObject, SetStateAction} from "react";
import React, { useState} from "react";
import styles from "@/pages/project/list/style.less";
import {Button, Card, Col, Row} from "antd";
import type { ProColumns} from "@ant-design/pro-table";
import ProTable, {EditableProTable} from "@ant-design/pro-table";
import {ProForm, ModalForm, ProFormDateTimeRangePicker, ProFormSwitch, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {EditOutlined, PlusOutlined} from "@ant-design/icons";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import {getInspectionContacts, getInspectors, queryWorkers} from "@/pages/service";
import {WorkerData, ContactData, InspectorData, PaginationData} from "@/pages/data";

type FormProps = {
  projectId?: number;
  formRef: MutableRefObject<any>;
  inspectionDisable: boolean;
  setInspectionDisable: Dispatch<SetStateAction<boolean>>;
};

const InspectionStepForm: React.FC<FormProps> = (props) => {
  const debug = true;
  // const [inspectionDisable, setInspectionDisable] = useState<boolean>(false);
  const [inspectorChooseModelVisible, handleInspectorChooseModelVisible] = useState<boolean>(false);

  const workerListColumns: ProColumns<WorkerData>[] = [
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
  ];

  const inspectorListColumns: ProColumns<InspectorData>[] = [
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
            key="inspectorEdit"
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

  const onNeedInspectionChange = (checked: boolean) => {
    // props.formRef.current?.setFieldValue("need_inspection", checked);
    props.setInspectionDisable(!checked);
  };

  return(
    <>
      <Card title="Arrangement" className={styles.card} bordered={true}>
        <ProFormText
          name="inspection_id"
          hidden={!debug}/>
        <ProFormText
          name="project_id"
          hidden={!debug}
          initialValue={props.projectId}/>
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
                checkedChildren: "Yes",
                unCheckedChildren: "No",
                defaultChecked: true,
                onChange: onNeedInspectionChange
              }}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormDateTimeRangePicker
              name="inspection_time"
              label="Inspection Time"
              fieldProps={{
                format: "YYYY-MM-DD HH:mm",
              }}
              disabled={props.inspectionDisable}
              rules={[{required: !props.inspectionDisable}]}
            />
          </Col>
          <Col span={24}>
            <ProFormTextArea
              fieldProps={{autoSize: {minRows: 3, maxRows: 5}}}
              label="Note"
              name="inspection_note"
              disabled={props.inspectionDisable}
              rules={[{required: false, message: 'Please input inspection note'}]}
              placeholder="Please input inspection note"
              initialValue="Test Note"/>
          </Col>

          <Col span={24} hidden={props.inspectionDisable}>
            <ProTable<InspectorData>
              headerTitle="Inspectors"
              name="inspectors"
              rowKey="id"
              search={false}
              toolBarRender={() => [
                <Button
                  type="primary"
                  key="projectAddButton"
                  onClick={() => {
                    handleInspectorChooseModelVisible(true);
                  }}
                >
                  <PlusOutlined /> Add
                </Button>,
              ]}
              // recordCreatorProps={{
              //   record: () => {
              //     return {
              //       id: `-${Date.now()}`,
              //     };
              //   },
              //   creatorButtonText: 'Add Inspector',
              // }}
              columns={inspectorListColumns}
              // value={contactData}
              // onChange={setContactData}
              request = {
                async () => {
                  if(props.projectId) {
                    return await getInspectors({id: props.projectId});
                  }
                  const nullContacts = {} as InspectorData
                  return nullContacts;
                }
              }
              // editable={{
              //   type: 'multiple',
              //   form: contactEditableForm,
              //   actionRender: (row, config, defaultDoms) => {
              //     return [defaultDoms.save, defaultDoms.delete, defaultDoms.cancel];
              //   },
              //   // onCancel: async (key, row, originRow, newLinew) => {
              //   //   contactEditableForm.resetFields([key]);
              //   // },
              // }}
            />
          </Col>

          <Col span={24} hidden={props.inspectionDisable}>
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
              request = {
                async () => {
                  if(props.projectId) {
                    return await getInspectionContacts({id: props.projectId});
                  }
                  const nullContacts = {} as ContactData
                  return nullContacts;
                }
              }
              // editable={{
              //   type: 'multiple',
              //   form: contactEditableForm,
              //   actionRender: (row, config, defaultDoms) => {
              //     return [defaultDoms.save, defaultDoms.delete, defaultDoms.cancel];
              //   },
              //   // onCancel: async (key, row, originRow, newLinew) => {
              //   //   contactEditableForm.resetFields([key]);
              //   // },
              // }}
            />
          </Col>
        </Row>
      </Card>
      <Card title="Report" className={styles.card} bordered={true} style={{marginTop: 20, paddingBottom: 40}}
            hidden={props.inspectionDisable}>
        <Row gutter={16}>
          <Col span={24}>
            {/*<ProFormTextArea*/}
            {/*  fieldProps={{autoSize: {minRows: 20}}}*/}
            {/*  name="inspection_report"*/}
            {/*  disabled={inspectionDisable}*/}
            {/*  rules={[{required: false, message: 'Please input inspection report'}]}*/}
            {/*  placeholder="Please input inspection report"*/}
            {/*  initialValue="Test report"/>*/}
            <ProForm.Item
              name="inspection_report">
              <ReactQuill
                theme="snow"
                style={{
                  height: "500px",
                }}
                modules={{
                  toolbar: [
                    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                    [{size: []}],
                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
                    ['link', 'image', 'video'],
                    ['clean']
                  ]
                }}
              />
            </ProForm.Item>
          </Col>
        </Row>
      </Card>

      <ModalForm
        title="Choose Inspector"
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
        visible={inspectorChooseModelVisible}
        onVisibleChange={handleInspectorChooseModelVisible}
        onFinish={async(values) => {
          handleInspectorChooseModelVisible(false);
        }}
      >
        <Row gutter={16}>
          <Col span={24}>
            <ProTable<WorkerData, PaginationData>
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
                // type: "radio",
                onChange: (_, selectedRows) => {
                  // setChosenClient(selectedRows[0]);
                },
              }}
              request={queryWorkers}
              columns={workerListColumns}/>
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}

export default InspectionStepForm;
