import Head from 'next/head'

import CalcEditor from '@/components/CalcEditor';

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1 className="title">Hello</h1>

        <CalcEditor />
      </main>

      <style jsx>{`
        

          main {
             position: relative;
          }
      `}</style>
    </div>
  )
}
