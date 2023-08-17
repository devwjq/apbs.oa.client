import update from 'immutability-helper'
import type { FC } from 'react'
import React, {PropsWithChildren, useCallback, useState} from 'react'
import {QuoteDetailCard} from "@/pages/oa/project/components/QuoteDetailCard";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import styles from "@/pages/oa/project/style.less";
import {Button, Card, Col, Row} from "antd";
import {CloseCircleOutlined, PlusOutlined} from "@ant-design/icons";
import {ProjectData, QuoteDetailData} from "@/services/data";
import {ProFormGroup, ProFormList} from "@ant-design/pro-form";

type ContainerProps = PropsWithChildren<{
  projectData?: ProjectData;
}>;

export const QuoteDetailContainer: React.FC<ContainerProps> = (props) => {
  const [cards, setCards] = useState<QuoteDetailData[]>([{
    // id: 0,
    // work_scope: "",
    seq: 0,
  }]);

  if(!cards && props.projectData?.quote?.details && props.projectData?.quote?.details.length > 0) {
    setCards(props.projectData.quote.details);
  }

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setCards((prevCards: QuoteDetailData[]) =>
      update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as QuoteDetailData],
        ],
      }),
    )
  }, [])

  const renderCard = useCallback(
    (card: QuoteDetailData, index: number) => {
      console.log("card.id = "+card?.id);
      return (
        <QuoteDetailCard
          key={card.id}
          id={Number(card.id)}
          work_scope={card.work_scope}
          price={card.price}
          seq={index}
          moveCard={moveCard}
        />
      )
    },
    [],
  )

  return (
    <Card className={styles.card} bordered={true} title="Scope of Work"
      actions={[
        <Button
          type="primary"
          key="workScopeAddButton"
          onClick={() => {

          }}
        >
          <PlusOutlined /> Add
        </Button>
      ]}
    >
      <Row gutter={16}>
        <Col lg={24} md={24} sm={24}>
          <DndProvider backend={HTML5Backend}>
            {cards.map((card, index) => renderCard(card, index))}
          </DndProvider>
        </Col>
      </Row>
    </Card>
  )
}
