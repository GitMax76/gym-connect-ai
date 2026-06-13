import React, { createContext, useContext, useState } from 'react';

type BrandName = 'FitFlow' | 'GymConnect' | 'FitWeb';

interface BrandingContextType {
  brandName: BrandName;
  brandNameFull: string;
  brandInitials: string;
  setBrandName: (name: BrandName) => void;
  toggleBrandName: () => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brandName, setBrandNameState] = useState<BrandName>(() => {
    return (localStorage.getItem('gc_brand_name') as BrandName) || 'FitFlow';
  });

  const setBrandName = (name: BrandName) => {
    setBrandNameState(name);
    localStorage.setItem('gc_brand_name', name);
    // Update document title dynamically
    const fullName = name === 'GymConnect' ? 'GymConnect AI' : `${name} AI`;
    document.title = `${fullName} - The Liquid Fitness Network`;
  };

  const toggleBrandName = () => {
    const names: BrandName[] = ['FitFlow', 'GymConnect', 'FitWeb'];
    const currentIndex = names.indexOf(brandName);
    const nextIndex = (currentIndex + 1) % names.length;
    setBrandName(names[nextIndex]);
  };

  const brandNameFull = brandName === 'GymConnect' ? 'GymConnect AI' : `${brandName} AI`;
  const brandInitials = brandName === 'FitFlow' ? 'FF' : brandName === 'GymConnect' ? 'GC' : 'FW';

  return (
    <BrandingContext.Provider value={{ brandName, brandNameFull, brandInitials, setBrandName, toggleBrandName }}>
      {children}
    </BrandingContext.Provider>
  );
};
