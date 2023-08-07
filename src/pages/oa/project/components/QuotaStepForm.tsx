import { debug } from '@/pages/Env';
import styles from '@/pages/oa/project/style.less';
import {ModalForm, ProFormDatePicker, ProFormText} from '@ant-design/pro-form';
import {Button, Card, Col, Form, Row, Select, Switch, Tooltip} from 'antd';
import moment from 'moment';
import React, {useState} from 'react';
import {ProFormTextArea} from "@ant-design/pro-components";
import {GoogleOutlined, MailOutlined} from "@ant-design/icons";
import ProTable, {ProColumns} from "@ant-design/pro-table";
import {EmailData, PaginationData} from "@/services/data";
import {queryGmails} from "@/services/email";

const { Option } = Select;

type FormProps = {
  projectId?: number;
  setStepForm: Function;
  email?: string;
};

const QuotaStepForm: React.FC<FormProps> = (props) => {
  const [gmailChooseModelVisible, handleGmailChooseModelVisible] = useState<boolean>(false);
  const [chosenGmail, setChosenGmail] = useState<EmailData[]>();

  const form = Form.useFormInstance();
  props.setStepForm(2, form);
  form.setFieldValue("project_id", props.projectId);

  const emailAddonBefore = (
    <Select defaultValue="Email"
            onChange={(value) => {
              if(value === "gmail") {
                form.setFieldValue("email", "");
                form.setFieldValue("gmail", "");
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
      <Option value="email">Email</Option>
      <Option value="gmail">Gmail</Option>
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
      <Card className={styles.card} bordered={true}>
        <ProFormText name="project_id" hidden={!debug} initialValue={props.projectId} disabled={true} fieldProps={{addonBefore: "Project ID"}}/>
        <ProFormText name="gmail" hidden={!debug} disabled={true} fieldProps={{addonBefore: "Gmail Thread"}}/>
        <ProFormText name="oldEmail" hidden={!debug} disabled={true} fieldProps={{addonBefore: "Old Email"}}/>

        <Row gutter={16}>
          <Col lg={6} md={12} sm={24}>
            <ProFormText
              label="Quote NO."
              name="quote_number"
              disabled={true}
              placeholder="Automatic generated"
            />
          </Col>
          <Col lg={6} md={12} sm={24}>
            <ProFormDatePicker
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please select a date' }]}
              initialValue={moment()}
            />
          </Col>
          <Col lg={12} md={12} sm={24}>
            <ProFormText
              label="Email"
              name="email"
              initialValue={props.email}
              tooltip="You can give a email or choose a Gmail to reply."
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
          <Col lg={24} md={12} sm={24}>
            <ProFormText
              label="Site Address"
              name="site_address"
              rules={[
                { required: true, message: 'Please input site address' },
              ]}
            />
          </Col>
          <Col lg={24} md={24} sm={24}>
            <ProFormTextArea
              label="Reference"
              name="reference"
              fieldProps={{width: "100%", autoSize: {minRows: 4, maxRows: 4}}}
              rules={[{ required: false, message: 'Please input reference' }]}
            />
          </Col>
          <Col lg={24} md={12} sm={24}>
            <ProFormTextArea
              label="Invoice"
              name="invoice"
              fieldProps={{width: "100%", autoSize: {minRows: 4, maxRows: 4}}}
              rules={[{ required: true, message: 'Please input invoice information' }]}
            />
          </Col>
        </Row>
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

export default QuotaStepForm;
