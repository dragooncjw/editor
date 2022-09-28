export const ComEQ = ({ children }) => {
    return <span>{children}</span>
}

export const ComInt = ({ v, startOffset, endOffset }) => {
    return <span style={{ color: 'blue' }}>{v}</span>
}

export const ComFloat = ({ v, startOffset, endOffset }) => {
    return <span style={{ color: 'blue' }}>{v}</span>
}

export const ComAttr = ({ v, startOffset, endOffset }) => {
    return <span style={{ fontSize: '20px' }}>{v}</span>
}

export const ComMain = ({ children }) => {
    return <div id="main">{children}</div>
}

export const ComSpace = ({ v, startOffset, endOffset }) => {
    return <span>{v}</span>;
}

export const ComBracket = ({ text, startOffset, endOffset }) => {
    return <span style={{ color: 'red' }}>{text}</span>
}

export const ComOp = ({ text, startOffset, endOffset }) => {
    return <span style={{ fontStyle: 'italic', color: 'green' }}>{text}</span>
}


export const components = {
    main: ComMain,
    eq: ComEQ,
    int: ComInt,
    float: ComFloat,
    space: ComSpace,
    attr: ComAttr,
    bracket: ComBracket,
    op: ComOp,
};
