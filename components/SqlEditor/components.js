const Select = ({ image, startOffset, endOffset }) => {
    return <span
        style={{
        color: '#ecb731',
    }}>{image}</span>
}

const Integer = ({ image, startOffset, endOffset}) => {
    return <span
        style={{
        color: '#9f9fa3',
    }}>{image}</span>
}

const SystemIdentifier = ({ image, startOffset, endOffset}) => {
    return <span
        style={{ color: '#8ec06c' }}>{image}</span>
}

const UnknownIdentifier = ({ image, startOffset, endOffset}) => {
    return <span
        style={{ color: '#ed1b2e' }}>{image}</span>
}

const From = ({ image, startOffset, endOffset}) => {
    return <span
        style={{ color: '#004b79'}}>{image}</span>
}

const WhiteSpace = ({ image, startOffset, endOffset}) => {
    return <span
    >{image}</span>;
}

const Comma = ({ image, startOffset, endOffset}) => {
    return <span
        style={{ color: 'pink'}}>{image}</span>
}

export const components = {
    Select,
    SystemIdentifier,
    UnknownIdentifier,
    From,
    WhiteSpace,
    Integer,
    Comma,
};
