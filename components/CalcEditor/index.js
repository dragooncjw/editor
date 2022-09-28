import React, { useState, useMemo, useRef } from 'react';

import { parse } from './parser';

import { toElement } from "./util";

export default function CalcEditor() {
 const [value, setValue] = useState('');
 const lastSuccessElement = useRef();

 const element = useMemo(() => {
     try {
        const root = parse(value);
        const element = toElement(root[0]);

        lastSuccessElement.current = element;
     } catch(e) {
        debugger;
     }

     return lastSuccessElement.current;
 }, [value]);

 const handleInput = (e) => {
     setValue(e.target.innerText);
 }

 return (
  <div className="container">
      <div style={{
          background: '#E8F3FF',
          minHeight: 20,
      }}>
          {element}
      </div>
      {/*<textarea className="inputLayer" value={value} onChange={(e) => setValue(e.target.value)}></textarea>*/}
      <div className="inputLayer" contentEditable={true} onInput={handleInput}></div>

      <style jsx>{`
          .container {
            position: relative;
            width: 500px;
            height: 500px;
            border: 1px solid #1e80ff;
          }

          .inputLayer {
            position: absolute;
            top: 20px;
            left: 0;
            right: 0;
            bottom: 0;
            //opacity: 0;
            z-index: 2;
            
            color: transparent;
            background: transparent;
            border: none;
          }
          
          .inputLayer:focus {
            border: none;
          }
      `}</style>
  </div>
 );
}

