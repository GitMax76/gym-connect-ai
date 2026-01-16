import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
    const { language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === 'IT' ? 'EN' : 'IT');
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={toggleLanguage}
            className="flex items-center gap-2 hover:bg-slate-100"
        >
            <Globe className="w-4 h-4" />
            <span className="font-medium">{language}</span>
        </Button>
    );
};

export default LanguageSwitcher;
