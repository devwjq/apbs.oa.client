import update from 'immutability-helper'
import type { FC } from 'react'
import React, {PropsWithChildren, useCallback, useState} from 'react'
import {QuoteDetailCard} from "@/pages/oa/project/components/QuoteDetailCard";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import styles from "@/pages/oa/project/style.less";
import {Button, Card, Col, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {ProjectData, QuoteDetailData} from "@/services/data";

type ContainerProps = PropsWithChildren<{
  projectData?: ProjectData;
}>;

export const QuoteDetailContainer: React.FC<ContainerProps> = (props) => {
  let quoteDetaildata = [
    {
      work_scope: "",
    }
  ] as QuoteDetailData[];
  if(props.projectData?.quote?.details && props.projectData?.quote?.details.length > 0) {
    quoteDetaildata = props.projectData.quote.details;
  }

  const [cards, setCards] = useState(quoteDetaildata);

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
    (card: { id: number; work: string; price: number }, index: number) => {
      return (
        <QuoteDetailCard
          key={card.id}
          id={card.id}
          work={card.work}
          price={card.price}
          index={index}
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
            {cards.map((card, i) => renderCard(card, i))}
          </DndProvider>
        </Col>
      </Row>
    </Card>
  )
}
