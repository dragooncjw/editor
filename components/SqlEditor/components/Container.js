import React, { memo } from 'react';
import Caret from "@/components/SqlEditor/components/Caret";
import Textarea from "@/components/SqlEditor/components/Textarea";
import useMouseDown from "@/components/SqlEditor/hooks/useMouseDown";

const lines = [...Array(10).keys()];

export default memo(function Container({ root, text, setText, children, domId }) {
    const {caret, handleMouseDown, handleMouseUp, handleKeyDown} = useMouseDown({
        root,
        text,
        setText,
    });

    return (
        <div id="container" className="container" onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
            <div style={{
                position: 'relative',
                lineHeight: '20px',
                height: '100%',
            }}>
                <div style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                }}>
                    {lines.map(lineNo => <div key={lineNo} style={{height: '20px', color: "#aaa"}}>{lineNo}</div>)}
                </div>

                <div style={{
                    position: 'absolute',
                    left: '20px',
                    top: '20px',
                    bottom: 0,
                    right: 0,
                    background: '#E8F3FF',
                }} id={domId}>
                    <div>
                        {children}
                    </div>

                    <Caret caret={caret}></Caret>
                    <Textarea caret={caret} onKeyDown={handleKeyDown}></Textarea>
                </div>
            </div>

            <canvas id="canvas"></canvas>

            <style jsx>{`
                  .container {
                    position: relative;
                    width: 500px;
                    height: 500px;
                    border: 1px solid #1e80ff;
                    font-size: 14px;
                    font-family: "Courier New", Courier, monospace;
                  }
                `}</style>
        </div>
    );
});
