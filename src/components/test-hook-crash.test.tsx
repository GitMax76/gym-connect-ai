
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { render, fireEvent, screen } from '@testing-library/react';

// Simplified schema to mimic the Trainer logic
const schema = z.object({
    firstName: z.string().min(2),
    phone: z.string().regex(/^\+?[0-9\s-]{5,}$/),
});

const TestForm = () => {
    const { register, formState: { errors, isValid } } = useForm({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            firstName: "",
            phone: "+39 "
        }
    });

    return (
        <form>
            <input data-testid="name" {...register("firstName")} />
            <button disabled={!isValid}>Submit</button>
            {errors.firstName && <span data-testid="error">Error</span>}
        </form>
    );
};

// Simulation
try {
    const { getByTestId } = render(<TestForm />);
    const input = getByTestId('name');

    console.log("Simulating click/focus...");
    fireEvent.click(input);
    fireEvent.focus(input);

    console.log("Simulating input...");
    fireEvent.change(input, { target: { value: 'A' } });

    console.log("Test completed without crash.");
} catch (e) {
    console.error("CRASH DETECTED:", e);
    process.exit(1);
}
