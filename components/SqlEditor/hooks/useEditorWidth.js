import React, { useState, useEffect, useMemo } from 'react';

export default function useEditorWidth ({ domId }) {

    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const $innerContent = document.getElementById(domId);
            const rect = $innerContent.getBoundingClientRect();

            setContainerWidth(rect.width);
        }
    }, []);

    return useMemo(() => ({
        containerWidth,
    }), [containerWidth]);
}
