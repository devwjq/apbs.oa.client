import { debug } from '@/pages/Env';
import styles from '@/pages/oa/project/style.less';
import { ProFormDatePicker, ProFormText } from '@ant-design/pro-form';
import {Card, Col, Form, Row} from 'antd';
import moment from 'moment';
import React, { MutableRefObject } from 'react';

type FormProps = {
  projectId?: number;
  setStepForm: Function;
};

const QuotaStepForm: React.FC<FormProps> = (props) => {
  const form = Form.useFormInstance();
  props.setStepForm(2, form);
  form.setFieldValue("project_id", props.projectId);

  return (
    <Card className={styles.card} bordered={true}>
      <ProFormText name="project_id" hidden={!debug} initialValue={props.projectId} />

      <Row gutter={16}>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="Quota NO."
            name="quota_number"
            disabled={true}
            placeholder="Automatic generated"
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormDatePicker
            label="Date"
            name="quota_date"
            rules={[{ required: true, message: 'Please select a date' }]}
            initialValue={moment()}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="Site Address"
            name=""
            // disabled={props.clientDisable}
            disabled={true}
            rules={[
              { required: false, message: 'Please input client phone' },
              { pattern: /^(0[1-9])\d{8}$/, message: 'Please input correct phone number' },
            ]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="Email"
            name={['client', 'email']}
            // disabled={props.clientDisable}
            disabled={true}
            rules={[
              {
                required: false,
                type: 'email',
                whitespace: false,
                message: 'Please input client email',
              },
            ]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="Company Name"
            name={['client', 'company']}
            // disabled={props.clientDisable}
            disabled={true}
            rules={[{ required: false, message: 'Please input company name' }]}
          />
        </Col>
        <Col lg={6} md={12} sm={24}>
          <ProFormText
            label="Company ABN"
            name={['client', 'abn']}
            // disabled={props.clientDisable}
            disabled={true}
            rules={[
              { required: false, message: 'Please input company ABN' },
              { pattern: /^\d{11}$/, message: 'Please input correct ABN number' },
            ]}
          />
        </Col>
        <Col lg={12} md={24} sm={24}>
          <ProFormText
            label="Company Address"
            name={['client', 'address']}
            // disabled={props.clientDisable}
            disabled={true}
            rules={[{ required: false, message: 'Please input client address' }]}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default QuotaStepForm;
