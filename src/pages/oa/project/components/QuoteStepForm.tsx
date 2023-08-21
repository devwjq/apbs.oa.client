import { debug } from '@/pages/Env';
import styles from '@/pages/oa/project/style.less';
import {
  FormListActionType,
  ModalForm,
  ProFormDatePicker, ProFormGroup,
  ProFormList,
  ProFormMoney,
  ProFormText
} from '@ant-design/pro-form';
import {Button, Card, Col, Form, Popconfirm, Row, Select, Space, Switch, Tooltip} from 'antd';
import moment from 'moment';
import React, {useRef, useState} from 'react';
import {ProFormTextArea} from "@ant-design/pro-components";
import {
  ArrowDownOutlined,
  ArrowUpOutlined, DeleteOutlined,
  DeleteTwoTone,
  GoogleOutlined,
  MailOutlined,
  PlusOutlined
} from "@ant-design/icons";
import ProTable, {ProColumns} from "@ant-design/pro-table";
import {EmailData, PaginationData, ProjectData} from "@/services/data";
import {queryGmails} from "@/services/email";
import {FormInstance} from "antd/lib";
import {QuoteDetailContainer} from "@/pages/oa/project/components/QuoteDetailContainer";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import ReactQuillEditor from "@/components/ReactQuillEditor";
import ProCard from "@ant-design/pro-card";
import {forEach} from "lodash";

const detailCardStyle = {
  border: '1px dashed gray',
  // padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

const { Option } = Select;

type FormProps = {
  //projectId?: number;
  projectData?: ProjectData;
  setStepForm: (step: number, form: FormInstance) => void;
  email?: string;
};

const QuoteStepForm: React.FC<FormProps> = (props) => {
  const [gmailChooseModelVisible, handleGmailChooseModelVisible] = useState<boolean>(false);
  const [chosenGmail, setChosenGmail] = useState<EmailData[]>();

  const form = Form.useFormInstance();
  props.setStepForm(2, form);
  form.setFieldValue("project_id", props.projectData?.id);

  const detailCardActionRef = useRef<
    FormListActionType<{
      name: string;
    }>
  >();

  const emailAddonBefore = (
    <Select
      defaultValue="email"
      onChange={(value) => {
        if(value === "gmail") {
          form.setFieldValue("email", "");
          form.setFieldValue("gmail", "gmail");
          form.setFieldValue("oldEmail", "");
          // form.getFieldInstance("email").getFieldProps().setProperty("disabled" , "true");
          handleGmailChooseModelVisible(true);
        } else {
          // form.getFieldInstance("email").disabled = false;
          form.setFieldValue("email", "");
          form.setFieldValue("gmail", "");
          form.setFieldValue("oldEmail", "");
        }
      }}
      onSelect={(value) => {
        if(value === "gmail") {
          handleGmailChooseModelVisible(true);
        }
      }}
    >
      <Option value="email"><MailOutlined/></Option>
      <Option value="gmail"><GoogleOutlined/></Option>
    </Select>
  );

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
      width: 150,
      render: (_, record) => (
        <div>
          <input name="chooser" type="radio"
            onClick={() => {
              form.setFieldValue("email", record["email"]);
              form.setFieldValue("gmail", record["id"]);
              form.setFieldValue("oldEmail", record["email"]);
              form.validateFields({validateOnly: true});
              handleGmailChooseModelVisible(false);
            }}
          />&nbsp;
          <b>{_}</b>
        </div>
      ),
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      render: (_, record) => (
        <div>
          <div><b>{_}</b></div>
          {record.snippet ? <div>{record.snippet}</div> : ""}
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      align: 'right',
      width: 100,
      hideInSearch: true,
      render: (_, record) => <b>{_}</b>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      valueType: 'dateRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            start_date: value[0],
            end_date: value[1],
          };
        },
      },
    },
  ];

  return (
    <>
      <Card className={styles.card} bordered={true} title="Quote" style={{marginBottom: 20}}>
        <ProFormText name="project_id" hidden={!debug} initialValue={props.projectData?.id} disabled={true} fieldProps={{addonBefore: "Project ID"}}/>
        <ProFormText name="id" hidden={!debug} initialValue={props.projectData?.quote?.id} disabled={true} fieldProps={{addonBefore: "Quote ID"}}/>
        <ProFormText name="gmail" hidden={!debug} disabled={true} fieldProps={{addonBefore: "Gmail Thread"}}/>
        <ProFormText name="oldEmail" hidden={!debug} disabled={true} fieldProps={{addonBefore: "Old Email"}}/>
        <ProFormText name="action" hidden={!debug} disabled={true} fieldProps={{addonBefore: "Action"}}/>

        <Row gutter={16}>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              label="Quote NO."
              name="quote_number"
              disabled={true}
              placeholder="Automatic generated"
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="Email / Gmail"
              name="email"
              initialValue={props.email}
              tooltip="You can sent the quote to a email or choose a Gmail to reply."
              fieldProps={{
                addonBefore: emailAddonBefore,
                onChange: (e) => {
                  if(form.getFieldValue("gmail")) {
                    form.setFieldValue("email", form.getFieldValue("oldEmail"));
                  }
                },
                onClick: (e) => {
                  if(form.getFieldValue("gmail")) {
                    handleGmailChooseModelVisible(true);
                  }
                },
              }}
              rules={[
                {
                  required: true,
                  type: "email",
                  whitespace: false,
                  message: 'Please input quote email',
                },
              ]}
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormDatePicker
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please select a date' }]}
              initialValue={moment().format('YYYY-MM-DD')}
            />
          </Col>
          <Col lg={24} md={24} sm={24}>
            <ProFormText
              label="Site Address"
              name="site_address"
              rules={[
                { required: true, message: 'Please input site address' },
              ]}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormTextArea
              label="Invoice"
              name="invoice"
              fieldProps={{width: "100%", autoSize: {minRows: 4, maxRows: 4}}}
              rules={[{ required: true, message: 'Please input invoice information' }]}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormTextArea
              label="Reference"
              name="reference"
              fieldProps={{width: "100%", autoSize: {minRows: 4, maxRows: 4}}}
              rules={[{ required: false, message: 'Please input reference' }]}
            />
          </Col>
          <Col lg={24} md={24} sm={24}>
            <ProFormTextArea
              label="Description"
              name="description"
              fieldProps={{width: "100%", autoSize: {minRows: 4, maxRows: 10}}}
              rules={[{ required: false, message: 'Please input description' }]}
            />
          </Col>
          <Col lg={24} md={24} sm={24}>
            <ProFormTextArea
              label="Notes"
              name="note"
              fieldProps={{width: "100%", autoSize: {minRows: 4, maxRows: 10}}}
              rules={[{ required: false, message: 'Please input notes' }]}
            />
          </Col>
        </Row>
      </Card>

      {/*<QuoteDetailContainer*/}
      {/*  projectData={props.projectData}*/}
      {/*  />*/}

      <Card
        className={styles.card}
        bordered={true}
        title="Work"
        extra={[
          <Space size="large" align="start" style={{paddingTop: 0, marginBottom: -24}}>
            <ProFormText
              name="total_price"
              disabled={true}
              fieldProps={{
                addonBefore: "Total Price",
                style: {width: "100%"},
              }}
              initialValue={0}
            />
            <ProFormText
              name="gst"
              disabled={true}
              fieldProps={{
                addonBefore: "GST",
                style: {width: "100%"},
              }}
              initialValue={0}
            />
          </Space>
        ]}
      >
        <ProFormList
          name="details"
          // label="Scope of Work"
          min={1}
          actionRef={detailCardActionRef}
          initialValue={props.projectData?.quote?.details ? props.projectData?.quote?.details : [{

          }]}
          copyIconProps={false}
          deleteIconProps={false}
          itemRender={({ listDom, action }, { record }) => {
            return (
              <>
                {listDom}
              </>
            );
          }}
        >
          {(field, index, action, count) => {
            return (
              <ProCard
                title={"Work " + (index + 1)}
                style={{
                  ...detailCardStyle,
                  marginBlockEnd: 8,
                }}
                collapsible
                extra={[
                  <Space size="large" align="start" style={{paddingTop: 0, marginBottom: -24}}>
                    <ProFormMoney
                      name={"price"}
                      fieldProps={{
                        precision: 2,
                        addonBefore: "Price",
                        style: {width: "100%"},
                        onChange: (e) => {
                          let totalPrice = 0;
                          const details = form.getFieldValue("details");
                          details.forEach(function (detail : {price: number}) {
                            totalPrice = Number(totalPrice) + Number(detail.price);
                          });
                          const gst = Math.round(totalPrice*10.0)/100;
                          form.setFieldValue("total_price", totalPrice);
                          form.setFieldValue("gst", gst);
                        },
                      }}
                      customSymbol=" "
                      rules={[
                        {required: true, message: 'Please input price'},
                        {pattern: /^\d*(?:\.\d{0,2})?$/, message: 'Please input correct price'}
                      ]}
                      min={0}
                    />
                    { index == 0 ? null :
                      <Button
                        type="default"
                        shape="circle"
                        onClick={() => {
                          action.move(index, index-1);
                        }}
                      >
                        <ArrowUpOutlined />
                      </Button>
                    }
                    { index == count -1 ? null :
                      <Button
                        type="default"
                        shape="circle"
                        onClick={() => {
                          action.move(index, index+1);
                        }}
                      >
                        <ArrowDownOutlined />
                      </Button>
                    }
                    <Popconfirm
                      key="deleteDetailConfirm"
                      title="Delete this scope of work?"
                      onConfirm={() => {
                        if(count > 1) {
                          action.remove(index);
                        } else {
                          alert("At least 1 scope of work is required.")
                        }
                      }}
                      okText="Yes"
                      cancelText="No"
                    >
                      <Button
                        type="default"
                        shape="circle"
                      >
                        <DeleteOutlined style={{fontSize: '16px'}}/>
                      </Button>
                    </Popconfirm>
                  </Space>
                ]}
              >
                <Row gutter={16}>
                  <Col lg={24} md={24} sm={24}>
                    <ProFormText
                      name={"id"}
                      hidden={!debug}
                      disabled={true}
                      fieldProps={{addonBefore: "Quote Detail ID"}}
                    />
                    <ProFormText
                      name={"seq"}
                      hidden={!debug}
                      disabled={true}
                      fieldProps={{addonBefore: "Quote Detail Seq"}}
                    />
                    <ReactQuillEditor
                      name={"work_scope"}
                      height="300px"
                      rules={[{required: true, message: 'Please input work scope'}]}
                    />
                  </Col>
                </Row>
              </ProCard>
            )
          }}
        </ProFormList>
      </Card>

      <ModalForm
        title="Choose Gmail"
        width="90%"
        // modalProps={{
        //   destroyOnClose: true,
        // }}
        submitter={false}
        open={gmailChooseModelVisible}
        onOpenChange={handleGmailChooseModelVisible}
      >
        <Row gutter={16}>
          <Col span={24}>
            <ProTable<EmailData, PaginationData>
              headerTitle="Result"
              rowKey="id"
              // search={{
              //   filterType: 'light',
              // }}
              search={{
                labelWidth: 'auto',
                filterType: 'query',
                span: 6
              }}
              // options={false}
              tableAlertRender={false}
              columns={emailListColumns}
              // rowSelection={{
              //   type: "radio",
              //   onChange: (_, selectedRows) => {
              //     setChosenGmail(selectedRows);
              //   },
              // }}
              manualRequest={true}
              scroll={{ y: screen.height*0.4 }}
              request={async (params, sort, filter) => {
                const response = await queryGmails(params);
                if (response.oauthUrl) {
                  console.log('oauthUrl = ' + response.oauthUrl);
                  window.open(response.oauthUrl);
                }

                return response;
              }}
              pagination={false}
            />
          </Col>
        </Row>
      </ModalForm>
    </>
  );
};

export default QuoteStepForm;
// export default DragDropContext(HTML5Backend)(QuotaStepForm);
