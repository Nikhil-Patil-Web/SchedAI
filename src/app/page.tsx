import Image from 'next/image'
import Header from './components/Header'
import Board from './components/Board'

export default function Home() {
  return (
    <main className=''>
      {/*Header */}
      <Header></Header>
      {/*Body */}
      <Board></Board>
    </main>
  )
}
