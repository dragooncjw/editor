import Head from 'next/head'
import { createEditor } from 'slate';

import { Slate, withReact } from "slate-react";

const initialValue = [];

let editor;
if (typeof window !== 'undefined') {
    editor = withReact(createEditor());
}

export default function SlatePage() {

    const renderEditor = () => {
        if (typeof window !== 'undefined') {
            return  <Slate editor={editor} value={initialValue} />;
        }

        return <></>;
    }

    return (
        <div className="container">
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <h1 className="title">Hello</h1>

                {renderEditor()}
            </main>
            <style jsx>{`
              main {
                 position: relative;
              }
          `}</style>
        </div>
    )
}
