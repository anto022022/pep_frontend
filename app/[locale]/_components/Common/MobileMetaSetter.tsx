'use client';

import { setMobileMeta } from '@/app/[locale]/_store/reducers/navbar_store';
import { useAppDispatch } from '@/app/[locale]/_store/store';
import { useEffect } from 'react';

interface Props {
    title: string;
    path: string;
}

const MobileMetaSetter = ({ title, path }: Props) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(setMobileMeta({ title, path }));
    }, [title, path]);

    return null; // no UI
};

export default MobileMetaSetter;
