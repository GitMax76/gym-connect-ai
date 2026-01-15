import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
    password?: string;
}

const PasswordRequirements: React.FC<PasswordRequirementsProps> = ({ password = '' }) => {
    const requirements = [
        { label: "Almeno 8 caratteri", valid: password.length >= 8 },
        { label: "Almeno una maiuscola", valid: /[A-Z]/.test(password) },
        { label: "Almeno una minuscola", valid: /[a-z]/.test(password) },
        { label: "Almeno un numero", valid: /[0-9]/.test(password) },
    ];

    return (
        <div className="text-xs space-y-1 mt-2 p-3 bg-slate-50 rounded-md border border-slate-100">
            <p className="font-medium text-slate-700 mb-2">Requisiti Password:</p>
            {requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-2">
                    {req.valid ? (
                        <Check className="w-3 h-3 text-green-500" />
                    ) : (
                        <X className="w-3 h-3 text-slate-300" />
                    )}
                    <span className={req.valid ? "text-green-600" : "text-slate-400"}>
                        {req.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default PasswordRequirements;
