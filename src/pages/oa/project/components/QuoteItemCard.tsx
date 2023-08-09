import type { Identifier, XYCoord } from 'dnd-core'
import type { FC } from 'react'
import React, {PropsWithChildren, useRef} from 'react'
import {Input, Button, Card, Col, Row, Space} from "antd";
import {ProFormTextArea} from "@ant-design/pro-components";
import {ProFormMoney, ProFormText} from "@ant-design/pro-form";
import {useDrag, useDrop} from "react-dnd";
import {CloseCircleTwoTone, CloseOutlined, DeleteTwoTone, DollarTwoTone, PlusOutlined} from "@ant-design/icons";
import ProCard from "@ant-design/pro-card";

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

interface DragItem {
  type: string
  id: number
  index: number
}

export const QuoteItemCard: FC<CardProps> = (props) => {
  const ref = useRef<HTMLDivElement>(null)

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: "QuoteItemCard",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
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
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: "QuoteItemCard",
    item: () => {
      return { id: props.id, index: props.index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0 : 1
  drag(drop(ref))
  return (
    <ProCard bordered={false} ref={ref} style={{ ...style, opacity }} data-handler-id={handlerId}
      title={"Quote "+(props.index+1)}
             subTitle="Subtitle test"
      collapsible
      hoverable
      extra={
        <Space size="large" align="start" style={{paddingTop: 0, marginBottom: -25}}>
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
            fieldProps={{width: "100%", autoSize: {minRows: 10}}}
            rules={[{ required: true, message: 'Please input scope of work' }]}
            initialValue={props.work}
          />
        </Col>
      </Row>
    </ProCard>
  )
}
