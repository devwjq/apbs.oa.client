import type {Dispatch, MutableRefObject, SetStateAction} from "react";
import React, {useState} from "react";
import styles from "@/pages/project/list/style.less";
import {Button, Card, Col, Popconfirm, Row} from "antd";
import type {ProColumns} from "@ant-design/pro-table";
import ProTable, {EditableProTable} from "@ant-design/pro-table";
import {ProForm, ModalForm, ProFormDateTimeRangePicker, ProFormSwitch, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {DeleteOutlined, EditOutlined, PlusOutlined} from "@ant-design/icons";
import 'react-quill/dist/quill.snow.css';
import {WorkerData, ContactData, InspectorData, PaginationData} from "@/services/data";
import {getInspectionContacts, getInspectors} from "@/services/inspection";
import {queryWorkers} from "@/services/worker";
import {debug} from "@/pages/Env";
import ReactQuillEditor from "@/pages/components/ReactQuillEditor";
import ReactQuillWithTableEditor from "@/pages/components/ReactQuillWithTableEditor";
import TestEditor from "@/pages/components/TestEditor";

type FormProps = {
  projectId?: number;
  formRef: MutableRefObject<any>;
  inspectionDisable: boolean;
  setInspectionDisable: Dispatch<SetStateAction<boolean>>;
  inspectorDataSource: InspectorData[];
  setInspectorDataSource: Dispatch<SetStateAction<InspectorData[]>>;
};

const InspectionStepForm: React.FC<FormProps> = (props) => {
  const [inspectorChooseModelVisible, handleInspectorChooseModelVisible] = useState<boolean>(false);
  const [chosenInspectors, setChosenInspectors] = useState<InspectorData[]>();

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
            onConfirm={(e)=>{
              let inspectorData = [] as InspectorData[];
              let i = 0;
              props.inspectorDataSource.forEach(function (inspector) {
                if(inspector.id !== Number(record.id)) {
                  inspectorData[i] = {
                    id: inspector.id,
                    name: inspector.name,
                    phone: inspector.phone,
                    email: inspector.email,
                    company: inspector.company,
                  }
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
              request = {
                async () => {
                  if((!props.inspectorDataSource || props.inspectorDataSource.length === 0) && props.projectId) {
                    const serverData = await getInspectors({id: props.projectId});
                    props.setInspectorDataSource(serverData.data);
                  }
                  return {success: true};
                }
              }
            />
          </Col>

          <Col span={24} hidden={props.inspectionDisable} style={{marginTop: 20}}>
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
                  return {success: false};
                }
              }
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
        </Row>
      </Card>
      <Card title="Report" className={styles.card} bordered={true} style={{marginTop: 20, paddingBottom: 40}}
            hidden={props.inspectionDisable}>
        <Row gutter={16}>
          <Col span={24}>
            <ProForm.Item
              name="inspection_report">
              {/*<ReactQuill*/}
              {/*  theme="snow"*/}
              {/*  style={{*/}
              {/*    height: "500px",*/}
              {/*  }}*/}
              {/*  modules={{*/}
              {/*    toolbar: {*/}
              {/*      container: [*/}
              {/*        [{'font': []}],*/}
              {/*        [{'header': ['1', '2', false]}],*/}
              {/*        [{size: []}],*/}
              {/*        [{'color': []}, {'background': []}],*/}
              {/*        ['bold', 'italic', 'underline', 'strike', 'blockquote'],*/}
              {/*        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],*/}
              {/*        [{ script: 'sub' }, { script: 'super' }], // 上下标*/}
              {/*        [{'align': []}],*/}
              {/*        ['image', 'video', 'link'],*/}
              {/*        ['clean']*/}
              {/*      ],*/}
              {/*      handlers: {*/}
              {/*        // image: uploadImage*/}
              {/*      }*/}
              {/*    }*/}
              {/*  }}*/}
              {/*/>*/}
              {/*<ReactQuillEditor/>*/}
              <ReactQuillWithTableEditor/>
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
        open={inspectorChooseModelVisible}
        onOpenChange={handleInspectorChooseModelVisible}
        onFinish={async(values) => {
          if(chosenInspectors && chosenInspectors.length > 0) {
            let inspectorData = JSON.parse(JSON.stringify(props.inspectorDataSource));  //深度copy数组
            let i = 0;
            chosenInspectors.forEach(function (chosenInspector) {
              let isExist = false;
              props.inspectorDataSource.forEach(function (dsInspector) {
                if(dsInspector.id === chosenInspector.id) {
                  isExist = true;
                }
              })

              if(!isExist) {
                inspectorData[props.inspectorDataSource.length + i] = {
                  id: chosenInspector.id,
                  name: chosenInspector.name,
                  phone: chosenInspector.phone,
                  email: chosenInspector.email,
                  company: chosenInspector.company,
                }
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
                labelWidth: "auto",
                filterType: "query",
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
                pageSize: 8
              }}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  )
}

export default InspectionStepForm;
