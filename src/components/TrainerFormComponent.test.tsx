
// @vitest-environment jsdom
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import TrainerRegistrationForm from './TrainerRegistrationForm';
import { LanguageProvider } from '@/contexts/LanguageContext';

// Mock UI components
vi.mock("@/components/ui/select", () => ({
    Select: ({ children, onValueChange }: any) => <div data-testid="select">{children}</div>,
    SelectTrigger: ({ children }: any) => <button>{children}</button>,
    SelectValue: () => <span>Value</span>,
    SelectContent: ({ children }: any) => <div>{children}</div>,
    SelectItem: ({ children, value, onClick }: any) => <div onClick={onClick} data-value={value}>{children}</div>,
}));

describe('TrainerRegistrationForm Crash Test', () => {
    it('does not crash on input interaction', () => {
        const handleSubmit = vi.fn();
        const handleBack = vi.fn();

        render(
            <LanguageProvider>
                <TrainerRegistrationForm onSubmit={handleSubmit} onBack={handleBack} />
            </LanguageProvider>
        );

        // Find inputs - use getAll and take first to avoid ambiguity with Labels
        const nameInputs = screen.getAllByLabelText(/Nome/i);
        const nameInput = nameInputs[0];

        // Interact
        fireEvent.click(nameInput);
        fireEvent.change(nameInput, { target: { value: 'M' } });

        // Check if still alive
        expect(nameInput).toBeTruthy();
    });
});
