import InspectionStepForm from '@/pages/oa/project/components/InspectionStepForm';
import QuotaStepForm from '@/pages/oa/project/components/QuotaStepForm';
import RequirementStepForm from '@/pages/oa/project/components/RequirementStepForm';
import type {InspectionData, ProjectData, QuoteData} from '@/services/data';
import { InspectorData } from '@/services/data';
import { getInspection, updateInspection } from '@/services/inspection';
import { getProject, updateProject } from '@/services/project';
import {LeftOutlined, MailOutlined, RightOutlined, SaveOutlined} from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import { StepsForm } from '@ant-design/pro-form';
import { RouteContext } from '@ant-design/pro-layout';
import {Button, Drawer, Form, message, notification} from 'antd';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import React, { useRef, useState } from 'react';
import {FormInstance} from "antd/lib";
import {getQuote} from "@/services/quote";
import update from "immutability-helper";

type FormProps = {
  projectData?: ProjectData;
  projectListRef: MutableRefObject<any>;
  visible: boolean;
  onVisibleChange: Dispatch<SetStateAction<boolean>>;
};

const ProjectManageDrawer: React.FC<FormProps> = (props) => {
  const [init, setInit] = useState(false);
  const [data, setData] = useState<ProjectData>();
  const [step, setStep] = useState(0);

  const [notificationApi, contextHolder] = notification.useNotification();

  const requirementStepFormRef = useRef<ProFormInstance>();

  const [inspectorDataSource, setInspectorDataSource] = useState<InspectorData[]>([]);

  const stepForm: FormInstance[] = [];
  const setStepForm = (step: number, form: FormInstance) => {
    stepForm[step] = form;
  };

  const filterHTMLTag = (html: string) => {
    let text = html.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
    text = text.replace(/[|]*\n/, '') //去除行尾空格
    text = text.replace(/&nbsp;/ig, ''); //去掉npsp
    text = text.replace(/\s+/g, ''); //去掉空格
    return text;
  }

  if (props.visible && !init) {
    if (props.projectData && props.projectData.id && props.projectData.progress) {
      // const serverResponse = getProject({id: Number(props.projectListData.id)});
      // serverResponse.then((serverData) => {
      //   projectData = serverData;
      // });
      setData(props.projectData);
      setStep(props.projectData.progress);
    } else {
      // const serverResponse = getProject({id: Number(props.projectListData.id)});
      // serverResponse.then((serverData) => {
      //   projectData = serverData;
      // });
      setData({
        progress: 0,
      });
      setStep(0);
    }
    setInit(true);
  }

  const changeStep = (value: number) => {
    setStep(value);
  };

  return (
    <>
      {contextHolder}
      <RouteContext.Consumer>
        {({ isMobile }) => (
          <StepsForm
            stepsProps={{
              labelPlacement: 'vertical',
              // direction: isMobile ? 'vertical' : 'horizontal',
              size: isMobile ? 'small' : 'default',
            }}
            containerStyle={{ width: '100%' }}
            current={step}
            onCurrentChange={changeStep}
            submitter={{
              render: (p) => {
                if (p.step === 0) {
                  return (
                    <div style={{ textAlign: 'right', marginRight: 25 }}>
                      <Button
                        key="next"
                        type="primary"
                        onClick={() => p.onSubmit?.()}
                        style={{ marginRight: 10 }}
                      >
                        Save & Next <RightOutlined />
                      </Button>
                    </div>
                  );
                } else if (p.step === 2) {
                  return (
                    <div style={{ textAlign: 'right', marginRight: 25 }}>
                      <Button key="pre" onClick={() => p.onPre?.()} style={{ marginRight: 10 }}>
                        <LeftOutlined /> Previous
                      </Button>
                      {props.projectData?.quote?.id ?
                        <>
                          <Button key="save" onClick={() => p.onSubmit?.()} style={{ marginRight: 10 }}>
                            <SaveOutlined /> Save
                          </Button>
                          {props.projectData?.quote?.send ?
                            <>
                              <Button key="save" onClick={() => p.onSubmit?.()} style={{ marginRight: 10 }}>
                                <SaveOutlined /> Save
                              </Button>
                              <Button key="next" type="primary" onClick={() => p.onSubmit?.()}>
                                Next <RightOutlined />
                              </Button>
                            </>
                            :
                            <>
                              <Button key="save" type="primary" onClick={() => p.onSubmit?.()} style={{ marginRight: 10 }}>
                                <SaveOutlined /> Save
                              </Button>
                              <Button key="next" onClick={() => p.onSubmit?.()}>
                                Next <RightOutlined />
                              </Button>
                            </>
                          }
                        </>
                        :
                        <>
                          <Button key="save" type="primary" onClick={() => p.onSubmit?.()} style={{ marginRight: 10 }}>
                            <SaveOutlined /> Save
                          </Button>
                          <Button key="send" onClick={() => p.onSubmit?.()}>
                            <MailOutlined/> Send
                          </Button>
                        </>
                      }
                    </div>
                  );
                } else if (p.step === 4) {
                  return (
                    <div style={{ textAlign: 'right', marginRight: 25 }}>
                      <Button key="pre" type="primary" onClick={() => p.onPre?.()}>
                        <LeftOutlined /> Previous
                      </Button>
                    </div>
                  );
                } else {
                  return (
                    <div style={{ textAlign: 'right', marginRight: 25 }}>
                      <Button key="pre" onClick={() => p.onPre?.()} style={{ marginRight: 10 }}>
                        <LeftOutlined /> Previous
                      </Button>
                      <Button key="next" type="primary" onClick={() => p.onSubmit?.()}>
                        Save & Next <RightOutlined />
                      </Button>
                    </div>
                  );
                }
              },
            }}
            stepsFormRender={(dom, submitter) => {
              return (
                <Drawer
                  title={'Project: ' + (data && data.name ? data.name : 'New')}
                  width="100%"
                  visible={props.visible}
                  footer={submitter}
                  onClose={() => {
                    setInit(false);
                    setData(undefined);
                    setStep(0);
                    setInspectorDataSource([]);
                    props.projectListRef.current.reload();
                    props.onVisibleChange(false);
                  }}
                  destroyOnClose={true}
                >
                  {dom}
                </Drawer>
              );
            }}
          >
            <StepsForm.StepForm<ProjectData>
              formRef={requirementStepFormRef}
              title="Request"
              autoFocusFirstInput
              request={async () => {
                if (data?.id) {
                  // setRequirementStepFormClientDisable(true);
                  return await getProject({ id: Number(data?.id) });
                }
                // setRequirementStepFormClientDisable(false);
                const nullProject = {} as ProjectData;
                return nullProject;
              }}
              onFinish={async (values?: ProjectData) => {
                if (values) {
                  // const isClientDisabled = requirementStepFormClientDisable;
                  // setRequirementStepFormClientDisable(false);
                  const response = await updateProject(values);
                  // setRequirementStepFormClientDisable(isClientDisabled);
                  if(response.result) {
                    setData({
                      id: response.id,
                    });
                  }
                  return response.result;
                }
              }}
            >
              <RequirementStepForm
                projectId={Number(data?.id)}
                formRef={requirementStepFormRef}
                setStepForm={setStepForm}
              />
            </StepsForm.StepForm>

            <StepsForm.StepForm<InspectionData>
              title="Inspection"
              autoFocusFirstInput
              request={async () => {
                if (data?.id) {
                  return await getInspection({ projectId: Number(data?.id) });
                }
                const nullInspection = {} as InspectionData;
                return nullInspection;
              }}
              onFinish={async (values?: InspectionData) => {
                if(values && (!values.inspection_report || filterHTMLTag(values.inspection_report).length == 0)) {
                  values.inspection_report = "";
                }
                if(values && (values.inspection_need == undefined || values.inspection_need)
                  && (!values.inspection_report || values.inspection_report.length == 0)) {
                  notificationApi.info({
                    message: `Saved, awaiting the inspection report.`,
                    description:
                      'The inspection information has been saved, but the next step cannot be taken until the inspection report is completed.',
                    placement: 'top',
                    duration: 20,
                  });
                }
                if (values) {
                  const formData = { ...values, inspectors: inspectorDataSource };
                  const success = await updateInspection(formData);
                  return success;
                }
              }}
            >
              <InspectionStepForm
                projectId={Number(data?.id)}
                setStepForm={setStepForm}
                inspectorDataSource={inspectorDataSource}
                setInspectorDataSource={setInspectorDataSource}
              />
            </StepsForm.StepForm>

            <StepsForm.StepForm<QuoteData>
              title="Quote"
              // initialValues={data}
              request={async () => {
                if (data?.id) {
                  const quote = await getQuote({ projectId: Number(data?.id) });
                  setData(update(data, {quote: {$set: quote}}));
                  return quote;
                }
                const nullQuote = {} as QuoteData;
                return nullQuote;
              }}
              onFinish={async (values?: QuoteData) => {
                if(values && (!values.inspection_report || filterHTMLTag(values.inspection_report).length == 0)) {
                  values.inspection_report = "";
                }
                if(values && (values.inspection_need == undefined || values.inspection_need)
                  && (!values.inspection_report || values.inspection_report.length == 0)) {
                  notificationApi.info({
                    message: `Saved, awaiting the inspection report.`,
                    description:
                      'The inspection information has been saved, but the next step cannot be taken until the inspection report is completed.',
                    placement: 'top',
                    duration: 20,
                  });
                }
                if (values) {
                  const formData = { ...values, inspectors: inspectorDataSource };
                  const success = await updateInspection(formData);
                  return success;
                }
              }}
            >
              <QuotaStepForm
                // projectId={Number(data?.id)}
                projectData={data}
                setStepForm={setStepForm}
                email={props.projectData?.client?.email}
              />
            </StepsForm.StepForm>

            <StepsForm.StepForm<ProjectData>
              title="Assignment"
              // initialValues={data}
              onFinish={async (values) => {
                // setStep(values);
                // return true;
              }}
            />

            <StepsForm.StepForm<ProjectData>
              title="Payment"
              // initialValues={data}
              onFinish={async (values) => {
                // setStep(values);
                // return true;
              }}
            />
            <StepsForm.StepForm<ProjectData>
              title="Done"
              // initialValues={data}
              onFinish={async (values) => {
                // setStep(values);
                // return true;
              }}
            />
          </StepsForm>
        )}
      </RouteContext.Consumer>
    </>
  );
};

export default ProjectManageDrawer;
