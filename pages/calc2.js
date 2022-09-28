import Head from 'next/head'

import CalcEditorX2 from '@/components/CalcEditorX2';
import CalcFunction from '@/components/CalcFunction';

export default function Calc() {

    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className="title">Hello</h1>

                <CalcEditorX2 />
            </main>
            <CalcFunction />
            <style jsx>{`
              main {
                 position: relative;
              }
          `}</style>
        </div>
    )
}
