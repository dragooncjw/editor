import React, { useMemo, useState } from 'react';
import useEditorWidth from "@/components/SqlEditor/hooks/useEditorWidth";
import {parse} from "@/chevrotain/parser";
import {layout} from "@/components/SqlEditor/util";

export default function useRoot () {

    const [text, setText] = useState('SELECT abc, evanasecence, Preumonoultramicroscopicsilicovolcanoconiosis, Preumonoultramicroscopicsilicovolcanoconiosis, evanasecence, Preumonoultramicroscopicsilicovolcanoconiosis, Preumonoultramicroscopicsilicovolcanoconiosis FROM table');

    const {containerWidth} = useEditorWidth({ domId: 'innerContainer' });

    return useMemo(() => {
        if (typeof window === 'undefined') {
            return [];
        }

        const result = parse(text).lexingResult;
        const _tokens = result.tokens;

        const root = layout(_tokens, containerWidth);

        console.info('####root', root, containerWidth, _tokens);

        return {
            root,
            text,
            setText,
        };
    }, [text, setText, containerWidth]);
}
