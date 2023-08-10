import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import React, {PropsWithChildren, useRef, useState} from 'react'
import {Button, Card, Col, Row, Space} from "antd";
import {ProFormTextArea} from "@ant-design/pro-components";
import {ProFormMoney} from "@ant-design/pro-form";
import {useDrag, useDrop} from "react-dnd";
import {DeleteTwoTone} from "@ant-design/icons";
import ProCard from "@ant-design/pro-card";
import {QuoteDetailData} from "@/services/data";

const style = {
  border: '1px dashed gray',
  // padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}

type CardProps = PropsWithChildren<{
  id: number
  work: string
  price: number
  index: number
  moveCard: (dragIndex: number, hoverIndex: number) => void
}>;

export const QuoteDetailCard: FC<CardProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)
  const [subTitle, setSubTitle] = useState<string>("");

  let initSubTitle = props.work;
  if(initSubTitle.length > 40) {
    initSubTitle = subTitle.substring(0, 37) + "...";
  }

  const [{ handlerId }, drop] = useDrop<
    QuoteDetailData,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "QuoteItemCard",  // 指明该区域允许接收的拖放物。可以是单个，也可以是数组，里面的值就是useDrag所定义的type
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    // 拖拽物悬浮在拖放区域时，item为拖拽物携带的数据
    hover(item: QuoteDetailData, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.seq
      const hoverIndex = props.index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      props.moveCard(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.seq = hoverIndex
    },
  })

  // 第一个返回值isDragging是一个对象，主要放一些拖拽物的状态。后面会介绍，先不管
  // 第二个返回值drag：顾名思义就是一个Ref，只要将它注入到DOM中，该DOM就会变成一个可拖拽的DOM
  const [{ isDragging }, drag] = useDrag({
    type: "QuoteItemCard",  // 给拖拽物命名，后面用于分辨该拖拽物是谁，支持string和symbol
    item: () => { // 拖拽物所携带的数据，让后面一些事件可以拿到数据，已达到交互的目的
      return { id: props.id, index: props.index }
    },
    // 这个monitor会提供拖拽物状态的信息，我会在下面罗列所有monitor支持的方法
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(), // 是否处于拖拽状态
    }),
  })

  //根据状态去获取样式
  const opacity = isDragging ? 0 : 1

  //让目标DOM即能作为拖拽物，也能作为拖放区域
  drag(drop(ref))

  return (
    // 注入Ref,现在这个DOM就可以拖拽了
    <ProCard bordered={false} ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}
      title={"Quote "+(props.index+1)}
      subTitle={subTitle ? subTitle : initSubTitle}
      hoverable
      collapsible
      // defaultCollapsed
      // onCollapse={(collapsed: boolean) => {
      //   if(collapsed) {
      //     setSubTitle();
      //   } else {
      //     setSubTitle("");
      //   }
      // }}
      extra={
        <Space size="large" align="start" style={{paddingTop: 0, marginBottom: -24}}>
          <ProFormMoney
            name={"price_"+props.id}
            fieldProps={{
              precision: 2,
              addonBefore: "Price",
              style: {width: "100%"},
            }}
            customSymbol=" "
            rules={[
              {required: true, message: 'Please input price' },
              {pattern: /^\d*(?:\.\d{0,2})?$/, message: 'Please input correct price'}
            ]}
            initialValue={props.price}
            min={0}
          />
          <Button
            type="default"
            shape="circle"
            key="workAddButton"
            onClick={() => {

            }}
          >
            <DeleteTwoTone style={{ fontSize: '16px'}}/>
          </Button>
        </Space>
      }
    >
      <Row gutter={16}>
        <Col lg={24} md={24} sm={24}>
          <ProFormTextArea
            name={"work_scope_"+props.id}
            fieldProps={{
              width: "100%",
              autoSize: {minRows: 10},
              onChange: (e) => {
                if(e.target.value.length <= 40) {
                  setSubTitle(e.target.value);
                } else {
                  setSubTitle(e.target.value.substring(0, 37) + "...");
                }
              },
            }}
            rules={[{ required: true, message: 'Please input scope of work' }]}
            initialValue={props.work}
          />
        </Col>
      </Row>
    </ProCard>
  )
}
