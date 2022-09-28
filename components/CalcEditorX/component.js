export const TokenClz = `x-token`;

export const TokenWrap = ({ index, zeroSpace, children }) => {
    return <span className={TokenClz} data-index={index} data-zeroSpace={zeroSpace}>{children}</span>
}

export const FunctionType = ({ image }) => {
    return <span>{image}</span>
}

export const Unknown = ({ image }) => {
    return <span
        style={{
        color: 'red',
    }}>{image}</span>
}

export const LBracket = ({ image }) => {
    return <span>{image}</span>
}

export const RBracket = ({ image }) => {
    return <span>{image}</span>
}

export const Comma = ({ image }) => {
    return <span>{image}</span>
}

export const WhiteSpace = ({ image }) => {
    return <span>{image}</span>
}

export const Data = ({ image }) => {
    return <span contentEditable={false} style={{
        background: '#d9f5d6',
        padding: '0 10px',
        borderRadius: '10px',
        display: 'inline-block',
        height: '20px',
        lineHeight: '20px',
        fontSize: '14px',
        color: '#186010',
    }}>{image}</span>
}


