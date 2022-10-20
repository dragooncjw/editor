import React, { useEffect, useState } from 'react'

import { updateFunctionParamCursor$ } from './observables';

import { functionParamsCount, functionExampleDesc } from '../CalcEditorX2/lexer';
import { getToken } from './utils';

export default function CalcFunction() {
    const [functionType, setFunctionType] = useState('Date');
    const [activeIndex, setActiveIndex] = useState(0);
    const [errorInfo, setErrorInfo] = useState('');

    useEffect(() => {
        const subscription = updateFunctionParamCursor$.subscribe((caret) => {
            const currentToken = caret.editor.manager.currentToken
            console.log('asdklasjld', currentToken)
            console.log('asdklasjld cst', caret.editor.getAST())
            // 找到唯一对应的children的方法：
            // 1. tokenTypeIdx对应
            // 2. image对应
            const cst = caret.editor.getAST()
            if (cst.success) {
                console.log(cst.cst)
                setErrorInfo('')
                const { functionType,
                    actionIndex } = getToken(cst.cst, currentToken)
                setFunctionType(functionType)
                setActiveIndex(actionIndex)
                

                console.log('asdklasjld currentToken', currentToken)
                console.log('asdklasjld functionTypeAndactionIndex', functionType, actionIndex)
            } else {
                console.log('error')
                setErrorInfo(cst.errors[0].message)
            }
        });

        return () => {
            subscription.unsubscribe();
        }
    }, []);

    return <div style={{display: 'flex', flexDirection: 'column'}}>
    <div style={{ width: 383, padding: '12px 16px',border: '1px solid rgba(31,35,41, 0.15)' }}>
        <div style={{fontWeight: 500, display: 'inline'}}> {functionType} </div>
        {'('}{functionParamsCount[functionType]?.map((option, index) => 
        <>
                <div style={{background: activeIndex === index ? 'yellow' : '', display: 'inline', color: activeIndex === index ? 'black' : 'grey'}}>{option}</div>

                {(index === functionParamsCount[functionType]?.length - 1) ? '' : ','}
                </>
            )}{')'}<br />
    <span style={{width: 213, background: '#f5f6f7', fontSize: 12, padding: '2px 8px', borderRadius: 4, marginTop: 10}}>
        示例： {functionExampleDesc[functionType]}
    </span>
    </div>
    {errorInfo ? <div>CST Error: {errorInfo}</div> : null}
    </div>
}
