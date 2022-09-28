import chevrotain from "chevrotain";

import { SelectParser } from '@/chevrotain/parser';

const style = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    zIndex: '9999',
};

const parser = new SelectParser();
const serializedGrammar = parser.getSerializedGastProductions();

const html = chevrotain.createSyntaxDiagramsCode(serializedGrammar);


export default function Diagram() {
    return (
        <iframe src={`data:text/html;charset=utf-8,${encodeURI(html)}`} style={style}></iframe>
    );
}
