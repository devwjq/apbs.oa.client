import {DeleteOutlined, PlusOutlined, ScheduleOutlined} from '@ant-design/icons';
import {Button, Popconfirm, Progress} from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import styles from "@/pages/project/list/style.less";
import ProTable from "@ant-design/pro-table";
import type {PaginationData, ProjectData} from "@/services/data";
import ProjectManageDrawer from "@/pages/project/list/components/ProjectManageDrawer";
import {deleteProject, queryProjects} from "@/services/project";

const ProjectList: React.FC = () => {
  // const [projectEditDrawerVisible, handleProjectEditDrawerVisible] = useState<boolean>(false);
  const [projectManageDrawerVisible, handleProjectManageDrawerVisible] = useState<boolean>(false);

  const listRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<ProjectData>();

  const deleteConfirm = async (id: number) => {
    const success = await deleteProject({id: id});

    if (success && listRef.current) {
      listRef.current.reload();
    }
  }

  const projectListColumns: ProColumns<ProjectData>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch:false,
      sorter: true,
      fixed: 'left',
      width: 60,
      align: 'right',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      fixed: 'left',
      width: 200,
    },
    {
      title: 'Client',
      dataIndex: 'client_name',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      hideInForm: true,
      hideInSearch:true,
      render: (dom, entity) => {
        const progress = Math.ceil((entity.progress?entity.progress:0)*100/5);
        return (
          <div className={styles.listContentItem}>
            <Progress
              percent={progress}
              // status={
              //   ['active', 'exception', 'normal', 'success'][Math.ceil(Math.random() * 4) % 4] as
              //   | 'normal'
              //   | 'exception'
              //   | 'active'
              //   | 'success'
              // }
              strokeWidth={6} style={{ width: 100 }}
            />
          </div>
        );
      },
    },
    {
      title: 'Address',
      dataIndex: 'address',
      hideInForm: true,
    },
    {
      title: 'Date',
      sorter: true,
      dataIndex: 'issue_date',
      valueType: 'date',
      tip: 'Require Date',
      hideInSearch:true,
    },
    {
      title: 'Action',
      valueType: 'option',
      fixed: 'right',
      width: 60,
      render: (_, record) => [
        <a
          key="manage"
          onClick={() => {
            setCurrentRow(record);
            handleProjectManageDrawerVisible(true);
          }}
        >
          <ScheduleOutlined />
        </a>,
        // <a
        //   key="edit"
        //   onClick={() => {
        //     setCurrentRow(record);
        //     handleProjectEditDrawerVisible(true);
        //   }}
        // >
        //   <EditOutlined />
        // </a>,
        <Popconfirm
          key="deleteProjectConfirm"
          title="Delete this project?"
          onConfirm={(e)=>{
            setCurrentRow(record);
            deleteConfirm(Number(record.id));
          }}
          okText="Yes"
          cancelText="No"
        >
          <a>
            <DeleteOutlined />
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable<ProjectData, PaginationData>
        headerTitle="List"
        actionRef={listRef}
        rowKey="id"
        // scroll={{ x: 980 }}
        search={{
          labelWidth: "auto",
        }}
        pagination={{
          showSizeChanger: true,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="projectAddButton"
            onClick={() => {
              setCurrentRow(undefined);
              // handleProjectEditDrawerVisible(true);
              handleProjectManageDrawerVisible(true);
            }}
          >
            <PlusOutlined /> New
          </Button>,
        ]}
        columnsState={{
          defaultValue: { // 配置初始值；如果配置了持久化，仅第一次生效（没有缓存的第一次），后续都按缓存处理。
            // id: {
            //   show: false,
            // },
            // address: {
            //   show: false,
            // },
            // issue_date: {
            //   show: false,
            // },
          },
        }}
        request={queryProjects}
        columns={projectListColumns}
      />

      {/*<ProjectEditDrawer*/}
      {/*  projectListRef={listRef}*/}
      {/*  visible={projectEditDrawerVisible}*/}
      {/*  onVisibleChange={handleProjectEditDrawerVisible}*/}
      {/*  projectId={Number(currentRow?.id)}*/}
      {/*/>*/}

      <ProjectManageDrawer
        projectData={currentRow}
        projectListRef={listRef}
        visible={projectManageDrawerVisible}
        onVisibleChange={handleProjectManageDrawerVisible}
      />
    </PageContainer>
  );
};

export default ProjectList;
