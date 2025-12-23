import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useHint } from '../../context/HintContext';
import HintTab from './HintTab';
import HintModal from './HintModal';

const HintSystem = () => {
    const { isHintOpen } = useHint();

    return (
        <AnimatePresence mode="popLayout">
            {!isHintOpen && <HintTab />}
            {isHintOpen && <HintModal />}
        </AnimatePresence>
    );
};

export default HintSystem;
