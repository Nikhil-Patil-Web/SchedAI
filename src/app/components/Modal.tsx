'use client'
import { useState, Fragment, useRef, FormEvent } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useModalStore } from '../../../store/ModalStore'
import { useBoardStore } from '../../../store/BoardStore'
import TaskTypeRadioGroup from './TaskTypeRadioGroup'
import Image from 'next/image'
import { PhotoIcon } from '@heroicons/react/24/solid'

function Modal() {
  const imagePickerRef = useRef<HTMLInputElement>(null)

  const [isOpen, closeModal] = useModalStore((state) => [
    state.isOpen,
    state.closeModal,
  ])

  const [addTask, newTaskInput, setNewTaskInput, image, setImage, newTaskType] =
    useBoardStore((state) => [
      state.addTask,
      state.newTaskInput,
      state.setNewTaskInput,
      state.image,
      state.setImage,
      state.newTaskType,
    ])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!newTaskInput) return
    console.log(newTaskInput, newTaskType, image)
    addTask(newTaskInput, newTaskType, image)
    setImage(null)
    closeModal()
  }

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='form'
        className='relative z-10 '
        onSubmit={handleSubmit}
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Dialog.Panel className='w-full max-w-md  transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900 pb-2'
                >
                  Add a Task
                </Dialog.Title>
                <div className='mt-2'>
                  <input
                    type='text'
                    value={newTaskInput}
                    onChange={(e) => {
                      setNewTaskInput(e.target.value)
                    }}
                    placeholder='Enter a task here...'
                    className='w-full border border-gray-300 rounded-md outline-none p-5'
                  ></input>
                </div>
                <TaskTypeRadioGroup></TaskTypeRadioGroup>
                <div className='mt-2'>
                  <button
                    type='button'
                    onClick={() => {
                      imagePickerRef.current?.click()
                    }}
                    className='w-full border border-gray-300 rounded-md outline-none p-5 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2'
                  >
                    <PhotoIcon className='h-6 w-6 mr-2 inline-block'></PhotoIcon>
                    Upload Imgae
                  </button>
                  {image && (
                    <Image
                      onClick={() => {
                        setImage(null)
                      }}
                      src={URL.createObjectURL(image)}
                      alt='Uploaded Image'
                      width={200}
                      height={200}
                      className='w-full h-44 object-cover mt-2 filter hover:grayscale transition-all duration-150 cursor-not-allowed'
                    ></Image>
                  )}
                  <input
                    type='file'
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      if (!e.target.files![0].type.startsWith('image/')) {
                        return
                      }
                      setImage(e.target.files![0])
                    }}
                  ></input>
                </div>
                <div className='mt-2'>
                  <button
                    type='submit'
                    disabled={!newTaskInput}
                    className='inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2
focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300
disabled:cursor-not-allowed'
                  >
                    Add Task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default Modal
