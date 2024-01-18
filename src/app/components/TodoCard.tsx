import React from 'react'
import { Todo, TypedColumn } from '../../../typings'
import {
  DraggableProvidedDragHandleProps,
  DraggableProvidedDraggableProps,
} from 'react-beautiful-dnd'
import { XCircleIcon } from '@heroicons/react/24/solid'
import { useBoardStore } from '../../../store/BoardStore'

type Props = {
  todo: Todo
  index: number
  id: TypedColumn
  innerRef: (element: HTMLElement | null) => void
  draggableProps: DraggableProvidedDraggableProps
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined
}

function TodoCard({
  todo,
  index,
  id,
  innerRef,
  draggableProps,
  dragHandleProps,
}: Props) {
  const deleteTask = useBoardStore((state) => state.deleteTask)
  return (
    <div
      className='bg-white rounded-md space-y-2 drop-shadow-md'
      {...draggableProps}
      {...dragHandleProps}
      ref={innerRef}
    >
      <div className='flex justify-between items-center p-5'>
        <p>{todo.title}</p>
        <button className='text-red-500 hover:text-red-600'>
          <XCircleIcon
            onClick={() => {
              deleteTask(index, todo, id)
            }}
            className='ml-5 h-8 w-8'
          ></XCircleIcon>
        </button>
      </div>
    </div>
  )
}

export default TodoCard
