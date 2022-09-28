import React, { useState, useMemo, useRef } from 'react';

import { createLexer } from "./lexer";

import {isElement, toElement, getChar, moveCaretNext} from "./util";

import {TokenClz} from "./component";


const lexer = createLexer();

export default function CalcEditorX() {
 const [text, setText] = useState('DATE(单选, 日期, DAY(多选, 变量4))');

 const containerRef = useRef();

 const tokens = useMemo(() => {
     const result  = lexer.tokenize(text);
     return result.tokens;
 }, [text]);

 const elements = useMemo(() => {
   return toElement(tokens);
  }, [tokens]);

 const getOffset = () => {
     const selection = window.getSelection();
     if (!selection) {
         return;
     }

     const { anchorNode, anchorOffset } = selection;
     let node = anchorNode;

     if (!isElement(anchorNode)) {
         node = anchorNode.parentElement;
     }

     let $token = node;
     if (!node.classList.contains(TokenClz)) {
         $token = node.closest(`.${TokenClz}`);
     }

     const index = $token.dataset.index / 1;
     const token = tokens[index];

     return token.startOffset + anchorOffset;
 }

 const keydown = (e) => {
     let offset, chars;

     // 上下左右放行， 禁止回车
     switch (e.keyCode) {
         // arrow
         case 37:
         case 38:
         case 39:
         case 40:
             // e.preventDefault();
             // moveCaretNext(containerRef.current);

             break;
         case 13:
             // enter
             e.preventDefault();
             break;

         case 8:
             // backspace
             e.preventDefault();
             offset = getOffset();
             chars = text.split('');
             chars.splice(offset, 1);
             setText(chars.join(''));
             break;
         default:
             e.preventDefault();

             offset = getOffset();
             chars = text.split('');
             chars.splice(offset, 0, getChar(e.keyCode));
             setText(chars.join(''));

             // 无法移动光标， 总错位，应该和setText有关系；
             break;
     }
 }

 const keyup = () => {
     moveCaretNext(containerRef.current);
 }

 return (
  <>
      <div
          ref={containerRef}
          contentEditable={true}
          style={{ color: '#1f2329', outline: 'none' }}
          onKeyDown={keydown}
          onKeyUp={keyup}
          suppressContentEditableWarning={true}
      >
          {elements}
      </div>

      <button onClick={() => moveCaretNext(containerRef.current)}>test</button>
  </>
 );
}
