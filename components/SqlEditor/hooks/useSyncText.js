
import { Changeset } from 'changesets';

import dmpmod from 'diff_match_patch';

import React, { useState, useMemo, useEffect } from 'react';
import useEditorWidth from "@/components/SqlEditor/hooks/useEditorWidth";
import {parse} from "@/chevrotain/parser";
import {layout} from "@/components/SqlEditor/util";


const  dmp = new dmpmod.diff_match_patch();

function constructChangeset(text1, text2) {
    var diff = dmp.diff_main(text1, text2);
    dmp.diff_cleanupEfficiency(diff);
    return Changeset.fromDiff(diff);
}


export default function useSyncText({ text, domId }) {
    const [syncText, setSyncText] = useState('SELECT abc, evanasecence, Preumonoultramicroscopicsilicovolcanoconiosis, Preumonoultramicroscopicsilicovolcanoconiosis, evanasecence, Preumonoultramicroscopicsilicovolcanoconiosis, Preumonoultramicroscopicsilicovolcanoconiosis FROM table');
    const {containerWidth} = useEditorWidth({ domId });

    useEffect(() => {
        if (typeof window === 'undefined') {
            return [];
        }

        const changes = constructChangeset(syncText, text);
        setSyncText(changes.apply(syncText));

    }, [text]);

    return useMemo(() => {
        if (typeof window === 'undefined') {
            return [];
        }

        const result = parse(syncText).lexingResult;
        const _tokens = result.tokens;

        const syncRoot = layout(_tokens, containerWidth);

        return {
            syncRoot,
            syncText,
        };
    }, [syncText, containerWidth]);
}
