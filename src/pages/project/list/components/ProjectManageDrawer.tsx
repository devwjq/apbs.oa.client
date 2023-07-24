import InspectionStepForm from '@/pages/project/list/components/InspectionStepForm';
import QuotaStepForm from '@/pages/project/list/components/QuotaStepForm';
import RequirementStepForm from '@/pages/project/list/components/RequirementStepForm';
import type { InspectionData, ProjectData } from '@/services/data';
import { InspectorData } from '@/services/data';
import { getInspection, updateInspection } from '@/services/inspection';
import { getProject, updateProject } from '@/services/project';
import { LeftOutlined, RightOutlined, SaveOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-form';
import { StepsForm } from '@ant-design/pro-form';
import { RouteContext } from '@ant-design/pro-layout';
import {Button, Drawer, Form, message, notification} from 'antd';
import type { Dispatch, MutableRefObject, SetStateAction } from 'react';
import React, { useRef, useState } from 'react';
import {FormInstance} from "antd/lib";

type FormProps = {
  projectData?: ProjectData;
  projectListRef: MutableRefObject<any>;
  visible: boolean;
  onVisibleChange: Dispatch<SetStateAction<boolean>>;
};

const ProjectManageDrawer: React.FC<FormProps> = (props) => {
  const [notificationApi, contextHolder] = notification.useNotification();
  const [init, setInit] = useState(false);
  const [data, setData] = useState<ProjectData>();
  const [step, setStep] = useState(0);

  const projectStepsFormRef = useRef<ProFormInstance>();

  const requirementStepFormRef = useRef<ProFormInstance>();
  // const [requirementStepFormClientDisable, setRequirementStepFormClientDisable] = useState<boolean>(false);

  const inspectionStepFormRef = useRef<ProFormInstance>();
  let inspectionStepForm: FormInstance;
  const [inspectorDataSource, setInspectorDataSource] = useState<InspectorData[]>([]);

  const quotaStepFormRef = useRef<ProFormInstance>();

  const setInspectionStepForm = (form: FormInstance) => {
    inspectionStepForm = form;
  };


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
            formRef={projectStepsFormRef}
            stepsProps={{
              labelPlacement: 'vertical',
              // direction: isMobile ? 'vertical' : 'horizontal',
              size: isMobile ? 'small' : 'default',
            }}
            containerStyle={{ width: '100%' }}
            current={step}
            onCurrentChange={changeStep}
            submitter={{
              render: (props) => {
                if (props.step === 0) {
                  return (
                    <div style={{ textAlign: 'right', marginRight: 25 }}>
                      <Button
                        key="next"
                        type="primary"
                        onClick={() => props.onSubmit?.()}
                        style={{ marginRight: 10 }}
                      >
                        Save & Next <RightOutlined />
                      </Button>
                    </div>
                  );
                } else if (props.step === 4) {
                  return (
                    <div style={{ textAlign: 'right', marginRight: 25 }}>
                      <Button key="pre" type="primary" onClick={() => props.onPre?.()}>
                        <LeftOutlined /> Previous
                      </Button>
                    </div>
                  );
                } else {
                  return (
                    <div style={{ textAlign: 'right', marginRight: 25 }}>
                      <Button key="pre" onClick={() => props.onPre?.()} style={{ marginRight: 10 }}>
                        <LeftOutlined /> Previous
                      </Button>
                      <Button key="next" type="primary" onClick={() => props.onSubmit?.()}>
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
              onFinish={async (values?: ProjectData) => {
                if (values) {
                  // const isClientDisabled = requirementStepFormClientDisable;
                  // setRequirementStepFormClientDisable(false);
                  const success = await updateProject(values);
                  // setRequirementStepFormClientDisable(isClientDisabled);
                  return success;
                }
              }}
              request={async () => {
                if (data?.id) {
                  // setRequirementStepFormClientDisable(true);
                  return await getProject({ id: Number(data?.id) });
                }
                // setRequirementStepFormClientDisable(false);
                const nullProject = {} as ProjectData;
                return nullProject;
              }}
            >
              <RequirementStepForm
                projectId={Number(data?.id)}
                formRef={requirementStepFormRef}
                // clientDisable = {requirementStepFormClientDisable}
                // setClientDisable = {setRequirementStepFormClientDisable}
              />
            </StepsForm.StepForm>

            <StepsForm.StepForm<InspectionData>
              formRef={inspectionStepFormRef}
              title="Inspection"
              autoFocusFirstInput
              onFinish={async (values?: InspectionData) => {
                if(values && values.inspection_need && !values.inspection_report) {
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
              request={async () => {
                if (data?.id) {
                  return await getInspection({ projectId: Number(data?.id) });
                }
                const nullInspection = {} as InspectionData;
                return nullInspection;
              }}
            >
              <InspectionStepForm
                projectId={Number(data?.id)}
                formRef={inspectionStepFormRef}
                setForm={setInspectionStepForm}
                inspectorDataSource={inspectorDataSource}
                setInspectorDataSource={setInspectorDataSource}
              />
            </StepsForm.StepForm>

            <StepsForm.StepForm<ProjectData>
              title="Quota"
              // initialValues={data}
              onFinish={async (values) => {
                // setStep(values);
                // return true;
              }}
            >
              <QuotaStepForm projectId={Number(data?.id)} formRef={quotaStepFormRef} />
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
