import update from 'immutability-helper'
import type { FC } from 'react'
import React, { useCallback, useState } from 'react'
import {QuoteItemCard} from "@/pages/oa/project/components/QuoteItemCard";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import styles from "@/pages/oa/project/style.less";
import {Button, Card, Col, Row} from "antd";
import {PlusOutlined} from "@ant-design/icons";

export interface Item {
  id: number
  work: string
  price: number
}

export interface ContainerState {
  cards: Item[]
}

export const QuoteDetailContainer: FC = () => {
  {
    const [cards, setCards] = useState([
      {
        id: 1,
        work: 'Write a cool JS library',
        price: 100,
      },
      {
        id: 2,
        work: 'Make it generic enough',
        price: 200,
      },
      {
        id: 3,
        work: 'Write README',
        price: 300,
      },
    ])

    const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
      setCards((prevCards: Item[]) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as Item],
          ],
        }),
      )
    }, [])

    const renderCard = useCallback(
      (card: { id: number; work: string; price: number }, index: number) => {
        return (
          <QuoteItemCard
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
}
