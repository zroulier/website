import React, { createContext, useContext, useState, useEffect } from 'react';

const HintContext = createContext();

export const useHint = () => {
    const context = useContext(HintContext);
    if (!context) {
        throw new Error('useHint must be used within a HintProvider');
    }
    return context;
};

export const HintProvider = ({ children }) => {
    // Core State
    const [isHintOpen, setIsHintOpen] = useState(false);

    // Guide State
    const [activeStep, setActiveStep] = useState(0);
    const [hasSeenGuide, setHasSeenGuide] = useState(() => {
        return localStorage.getItem('hasSeenGuide') === 'true';
    });

    const openHint = () => setIsHintOpen(true);

    const closeHint = () => {
        setIsHintOpen(false);
        // Optional: Reset step on close or keep it? 
        // Let's reset to 0 so next time it starts fresh, or keep valid if user closed mid-way.
        // For a quick guide, resetting makes sense if they completed it, but if they closed it accidental... 
        // Let's reset only if completed or stick to 0 for now.
    };

    const nextStep = () => setActiveStep(prev => prev + 1);
    const prevStep = () => setActiveStep(prev => Math.max(0, prev - 1));
    const setStep = (step) => setActiveStep(step);

    const markGuideSucccess = () => {
        setHasSeenGuide(true);
        localStorage.setItem('hasSeenGuide', 'true');
        closeHint();
        setTimeout(() => setActiveStep(0), 300); // Reset after anim
    };

    const value = {
        isHintOpen,
        openHint,
        closeHint,
        activeStep,
        nextStep,
        prevStep,
        setStep,
        hasSeenGuide,
        markGuideSucccess
    };

    return (
        <HintContext.Provider value={value}>
            {children}
        </HintContext.Provider>
    );
};
