import { createElement } from 'react';

import { components } from './components';

export const toElement = (node) => {
    if (!node) {
        return null;
    }

    const component = components[node.type];

    if (!component) {
        return null;
    }

    const children = node.children || [];

    return createElement(component, { ...node }, ...(children.map(child => toElement(child))));
}
