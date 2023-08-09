import type {FC, PropsWithChildren, ReactNode} from 'react'
import React, { useCallback, useState } from 'react'
import {DndItem} from "@/components/dnd/DndItem";
import {DndProvider} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

export const DndContainer: FC = (props: PropsWithChildren) => {
  const [children, setChildren] = useState<DndItem[]>(React.Children.toArray(props.children));

  const moveChild = useCallback((dragIndex: number, hoverIndex: number) => {
    setChildren((prevChild: ReactNode[]) =>
      update(prevChild, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevChild[dragIndex] as ReactNode],
        ],
      }),
    )
  }, [])

  const renderChild = useCallback((child: ReactNode, index: number) => {
      return (child)
    },
    [],
  )

  const renderCard = useCallback(
    (card: { id: number; text: string }, index: number) => {
      return (
        <Card
          key={card.id}
          index={index}
          id={card.id}
          text={card.text}
          moveCard={moveCard}
        />
      )
    },
    [],
  )

  return (
    <DndProvider backend={HTML5Backend}>
      {children.map((child, i) => renderChild(child, i))}
    </DndProvider>
  )
}
