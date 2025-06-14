
import React from 'react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';

const AuthButton = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2"
        >
          <User className="w-4 h-4" />
          Dashboard
        </Button>
        <Button
          variant="outline"
          onClick={signOut}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={() => navigate('/auth')}
      >
        Accedi
      </Button>
      <Button
        onClick={() => navigate('/auth')}
        className="gradient-primary text-white"
      >
        Registrati
      </Button>
    </div>
  );
};

export default AuthButton;
