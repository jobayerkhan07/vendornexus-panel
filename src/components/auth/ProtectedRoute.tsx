import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Skeleton } from '@/components/ui/skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading, userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      console.log('No user found, redirecting to login...');
      navigate('/auth/login');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && userProfile && requiredRole && requiredRole.length > 0) {
      if (!requiredRole.includes(userProfile.role)) {
        navigate('/');
      }
    }
  }, [user, userProfile, requiredRole, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <Skeleton className="h-8 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}