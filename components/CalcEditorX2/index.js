import React, { useEffect, useRef } from 'react';

import {Editor} from "./core/editor";


export default function CalcEditorX2() {
    const containerRef = useRef();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const editor = new Editor({
                originText: 'DATE(单选,日期,DAY(多选,变量4))',
                // originText: '',
                mountNode: containerRef.current,
            });

            editor.event$.subscribe(() => {
               console.info('changed', editor.manager.tokens, editor.caret.offset);
               // 每次输入重新生成树
            });

            editor.caret.updatePos(7);
        }
    }, []);

 return (
  <div style={{ width: 414, border: '1px solid rgba(31,35,41, 0.15)' }} ref={containerRef}></div>
 );
}
