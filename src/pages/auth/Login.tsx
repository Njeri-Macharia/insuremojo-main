
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { authService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { LockKeyhole, User, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useUser } from '@/contexts/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { login: userLogin } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the context login function instead of directly calling authService
      const user = await userLogin(email, password);
      
      // Check if user is admin or staff
      if (user.role && ['admin', 'underwriter', 'support', 'manager'].includes(user.role)) {
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.name}`,
        });
        // Force navigation to admin dashboard
        navigate('/admin', { replace: true });
      } else {
        toast({
          variant: "destructive",
          title: "Access denied",
          description: "You don't have permission to access the admin area.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
      });
      
      // Update login attempts
      const currentAttempts = Number(localStorage.getItem('loginAttempts') || '0');
      const newAttempts = currentAttempts + 1;
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      // Check if max attempts reached
      if (newAttempts >= 7) {
        toast({
          variant: "destructive",
          title: "Account locked",
          description: "Maximum login attempts reached. Please contact IT support.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check for locked account
  React.useEffect(() => {
    const loginAttempts = Number(localStorage.getItem('loginAttempts') || '0');
    if (loginAttempts >= 7) {
      toast({
        variant: "destructive",
        title: "Account locked",
        description: "Maximum login attempts reached. Please contact IT support.",
      });
    }
  }, [toast]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Admin Login</CardTitle>
          <CardDescription>
            Enter your credentials to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                For demo: admin@insuremojo.co.ke / admin123
              </AlertDescription>
            </Alert>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login to Dashboard"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
