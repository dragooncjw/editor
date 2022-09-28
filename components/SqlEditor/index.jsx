import React from 'react';

import {toElement} from './util';

import Container from './components/Container';
import useRoot from './hooks/useRoot';
import useSyncText from './hooks/useSyncText';

const lines = [...Array(10).keys()];

/**
 * 计算公式可以参考这个Editor实现
 * 使用chevrotain 做lexer得到tokens
 * 参考carota的实现，做模型搭建
 * 根据模型做渲染, 模型在selection.js中
 * 如果要多人协作， 可以使用changesets库
 *
 * 模型如下：
 * Root -> Lines
 * Lines -> Tokens
 * Tokens -> Chars
 */
export default function SqlEditor() {
    const { text, setText, root } = useRoot();

    const { syncText, syncRoot } = useSyncText({ text, domId: 'innerContainer1' });

    return (
        <>
            <Container root={root} text={text} setText={setText} domId={'innerContainer'}>
                <>
                    {root?.lines?.map((line, index) => (
                        <div key={index} style={{height: `${line.height}px`}}>
                            {toElement(line.children || [])}
                        </div>
                    ))}
                </>
            </Container>

            <Container root={syncRoot} text={syncText} domId={'innerContainer1'}>
                <>
                    {syncRoot?.lines?.map((line, index) => (
                        <div key={index} style={{height: `${line.height}px`}}>
                            {toElement(line.children || [])}
                        </div>
                    ))}
                </>
            </Container>



            <canvas id="canvas"></canvas>
        </>
    );
}
