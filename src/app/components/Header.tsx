'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import Avatar from 'react-avatar'
import { useBoardStore } from '../../../store/BoardStore'
import fetchSuggestion from '../../../lib/fetchSuggestion'

function Header() {
  const [board, searchString, setSearchString] = useBoardStore((state) => [
    state.board,
    state.searchString,
    state.setSearchString,
  ])

  const [loading, setLoading] = useState<boolean>(false)
  const [suggesstion, setSuggestion] = useState<string>('')

  useEffect(() => {
    if (board.columns.size === 0) {
      return
    }
    // setLoading(true)
    // const fetchSuggestionString = async () => {
    //   const suggestion = await fetchSuggestion(board)
    //   setSuggestion(suggestion)
    //   setLoading(false)
    // }
    // fetchSuggestionString()
  }, [board])

  return (
    <header>
      <div className='flex flex-col md:flex-row items-center p-5 bg-gray-500/10 rounded-b-2xl'>
        <div className='absolute top-0 left-0 w-full h-96 bg-gradient-to-br from-pink-400 to-[#0055D1] rounded-md filter blur-3xl opacity-50 -z-50'></div>
        <Image
          src='https://res.cloudinary.com/nikhil-patil-web/image/upload/v1705333846/SchedAI-removebg-preview_ijrxfe.png'
          alt='Logo'
          className='w-44 md:w-56 pb-10 md:pb-0 object-contain'
          width={300}
          height={100}
        />

        <div className='flex items-center space-x-5  flex-1 justify-end w-full'>
          <form className='flex items-center space-x-5 bg-white rounded-md p-2 shadow-md flex-1 md:flex-initial'>
            <MagnifyingGlassIcon className='h-6 w-6 text-gray-600'></MagnifyingGlassIcon>
            <input
              type='text'
              placeholder='Search'
              value={searchString}
              onChange={(e) => {
                setSearchString(e.target.value)
              }}
              className='flex-1 outline-none p-2'
            ></input>
            <button type='submit' hidden>
              Search
            </button>
          </form>
          <Avatar name='Nikhil Patil' round color='#0055D1' size='50'></Avatar>
        </div>
      </div>
      <div className='flex items-center justify-center px-5 py-5 md:py-5'>
        <p className='flex items-center text-sm font-light pr-5 shadow-xl rounded-xl w-fit bg-white italic max-w-3xl text-[#0055D1]'>
          <UserCircleIcon
            className={`inline-block h-10 w-10 text-[#0055DI] mr-1`}
          ></UserCircleIcon>
          {suggesstion && !loading
            ? suggesstion
            : 'GPT is summarising the tasks for the day...'}
        </p>
      </div>
    </header>
  )
}

export default Header
