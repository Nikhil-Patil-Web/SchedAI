import { create } from 'zustand'
import { getTodosGroupedByColumn } from '../lib/getTodosGroupedByColumn'
import { Board, Column, Image, Todo, TypedColumn } from '../typings'
import { ID, databases, storage } from '../appwrite'
import uploadImage from '../lib/uploadImage'

interface BoardState {
  board: Board
  getBoard: () => void
  setBoardState: (board: Board) => void
  updateToDoInDB: (todo: Todo, columnId: TypedColumn) => void
  newTaskInput: string
  newTaskType: TypedColumn
  image: File | null
  setImage: (image: File | null) => void
  setNewTaskInput: (input: string) => void
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void
  searchString: string
  setSearchString: (searchString: string) => void
  setNewTaskType: (columnId: TypedColumn) => void
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    const board = await getTodosGroupedByColumn()
    set({ board })
  },
  setBoardState: (board) => set({ board }),
  updateToDoInDB: async (todo, columnId) => {
    await databases.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TOOLS_COLLECTION_ID!,
      todo.$id,
      { title: todo.title, status: columnId }
    )
  },
  image: null,
  setImage: (image: File | null) => set({ image }),

  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns)
    newColumns.get(id)?.todos.splice(taskIndex, 1)
    set({ board: { columns: newColumns } })
    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId)
    }
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TOOLS_COLLECTION_ID!,
      todo.$id
    )
  },
  searchString: '',
  newTaskInput: '',
  newTaskType: 'todo',
  setSearchString: (searchString) => set({ searchString }),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined
    if (image) {
      const fileUploaded = await uploadImage(image)
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        }
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TOOLS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    )

    set({ newTaskInput: '' })

    set((state) => {
      const newColumns = new Map(state.board.columns)
      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      }
      const column = newColumns.get(columnId)
      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        })
      } else {
        newColumns.get(columnId)?.todos.push(newTodo)
      }
      return {
        board: {
          columns: newColumns,
        },
      }
    })
  },
}))
