export const isElement = (node) => {
    return node?.nodeType === Node.ELEMENT_NODE;
}

export const isTextNode = (node) => {
    return node?.nodeType === Node.TEXT_NODE;
}
