import Head from 'next/head'

import CalcEditorX from '@/components/CalcEditorX';

export default function Calc() {
    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className="title">Hello</h1>

                <CalcEditorX />
            </main>
            <style jsx>{`
              main {
                 position: relative;
              }
          `}</style>
        </div>
    )
}
