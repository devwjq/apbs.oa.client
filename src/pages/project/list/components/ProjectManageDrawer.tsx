import type {Dispatch, MutableRefObject, SetStateAction} from "react";
import React, { useRef, useState} from "react";
import {FooterToolbar, RouteContext} from "@ant-design/pro-layout";
import {Button, Drawer} from "antd";
import type {InspectionData, ProjectData} from "@/pages/project/list/data";
import type {ProFormInstance} from "@ant-design/pro-form";
import {StepsForm} from "@ant-design/pro-form";
import RequirementStepForm from "@/pages/project/list/components/RequirementStepForm";
import InspectionStepForm from "@/pages/project/list/components/InspectionStepForm";
import {LeftOutlined, RightOutlined} from "@ant-design/icons";
import {getInspection, getProject, updateInspection, updateProject} from "@/pages/project/list/service";

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
  const projectStepsFormRef = useRef<ProFormInstance>();
  const requirementStepFormRef = useRef<ProFormInstance>();
  const [requirementStepFormClientDisable, setRequirementStepFormClientDisable] = useState<boolean>(false);
  const InspectionStepFormRef = useRef<ProFormInstance>();

  if(props.visible && !init) {
    if(props.projectData && props.projectData.id && props.projectData.progress) {
      // const serverResponse = getProject({id: Number(props.projectListData.id)});
      // serverResponse.then((serverData) => {
      //   projectData = serverData;
      // });
      setData(props.projectData);
      setStep(props.projectData.progress);
      setInit(true);
    }
  }

  const changeStep = (value: number) => {
    if(data && data.progress && value <= data?.progress) {
      setStep(value);
    }
  };

  return (
    <>
      <Drawer
        title={"Project: " + ((data && data.name) ? data.name : "New")}
        width="100%"
        visible={props.visible}
        onClose={() => {
          setInit(false);
          setData(undefined);
          setStep(0);
          props.projectListRef.current.reload();
          props.onVisibleChange(false);
        }}
        destroyOnClose={true}
      >
        <RouteContext.Consumer>
          {({ isMobile }) => (
            <StepsForm
              formRef={projectStepsFormRef}
              stepsProps={{
                labelPlacement: "vertical",
                // direction: isMobile ? 'vertical' : 'horizontal',
                size: isMobile ? 'small' : 'default',
              }}
              containerStyle={{width: '100%'}}
              current={step}
              onCurrentChange={changeStep}
              submitter={{
                render: (props) => {
                  if (props.step === 0) {
                    return (
                      // <FooterToolbar style={{width: `calc(100%)`}}>
                        <Button type="primary" onClick={() => props.onSubmit?.()}>
                          Save & Next <RightOutlined />
                        </Button>
                      // </FooterToolbar>
                    );
                  } else if (props.step === 4) {
                    return (
                      // <FooterToolbar style={{width: `calc(100%)`}}>
                        <Button type="primary" onClick={() => props.onPre?.()}>
                          <LeftOutlined /> Previous
                        </Button>
                      // </FooterToolbar>
                    );
                  } else {
                    return [<Button key="pre" onClick={() => props.onPre?.()}>
                          <LeftOutlined /> Previous
                        </Button>,
                        <Button key="next" type="primary" onClick={() => props.onSubmit?.()}>
                          Save & Next <RightOutlined />
                        </Button>];
                  }
                }
              }}
            >
              <StepsForm.StepForm<ProjectData>
                formRef={requirementStepFormRef}
                title="Requirement"
                autoFocusFirstInput
                onFinish={async (values?: ProjectData) => {
                  if(values) {
                    const isClientDisabled = requirementStepFormClientDisable;
                    setRequirementStepFormClientDisable(false);
                    const success = await updateProject(values);
                    setRequirementStepFormClientDisable(isClientDisabled);
                    return success;
                  }
                }}
                request={async () => {
                  if(data?.id) {
                    setRequirementStepFormClientDisable(true);
                    return await getProject({id: Number(data?.id)});
                  }
                  const nullProject = {} as ProjectData
                  return nullProject;
                }}
              >
                <RequirementStepForm
                  projectId = {Number(data?.id)}
                  formRef = {requirementStepFormRef}
                  clientDisable = {requirementStepFormClientDisable}
                  setClientDisable = {setRequirementStepFormClientDisable}
                />
              </StepsForm.StepForm>

              <StepsForm.StepForm<InspectionData>
                formRef={InspectionStepFormRef}
                title="Inspection"
                autoFocusFirstInput
                onFinish={async (values?: ProjectData) => {
                  if(values) {
                    const success = await updateInspection(values);
                    return success;
                  }
                }}
                request={async () => {
                  if(data?.id) {
                    return await getInspection({projectId: Number(data?.id)});
                  }
                  const nullInspection = {} as InspectionData
                  return nullInspection;
                }}
              >
                <InspectionStepForm
                  projectId={Number(data?.id)}
                  formRef = {InspectionStepFormRef}
                />
              </StepsForm.StepForm>
              <StepsForm.StepForm<ProjectData>
                title="Quota"
                // initialValues={data}
                onFinish={async (values) => {
                  // setStep(values);
                  // return true;
                }}
               />
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
      </Drawer>
    </>
  )
}

export default ProjectManageDrawer;
