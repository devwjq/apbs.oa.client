import React, {MutableRefObject} from "react";
import styles from "@/pages/project/list/style.less";
import {Card, Col, Row} from "antd";
import {ProFormSelect, ProFormText} from "@ant-design/pro-form";
import {debug} from "@/pages/Env";
import {getClientTypes} from "@/services/client";

type FormProps = {
  projectId?: number;
  formRef: MutableRefObject<any>;
};

const QuotaStepForm: React.FC<FormProps> = (props) => {
  return(
    <Card className={styles.card} bordered={true}>
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
                return null;
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
  )
}

export default QuotaStepForm;
