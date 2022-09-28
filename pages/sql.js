import Head from 'next/head'

import SqlEditor from '@/components/SqlEditor';

export default function Home() {
    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className="title">Hello</h1>

                <SqlEditor />
            </main>

            <style jsx>{`
          main {
             position: relative;
          }
      `}</style>
        </div>
    )
}
