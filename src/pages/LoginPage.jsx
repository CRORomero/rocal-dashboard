import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { LogIn, Lock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(email, password);

		if (result.success) {
		  toast({
			title: "¡Bienvenido!",
			description: "Has iniciado sesión correctamente.",
		  });
		  navigate('/dashboard');
		} else {
		  toast({
			variant: "destructive",
			title: "Error de autenticación",
			description: result.error || "Credenciales inválidas.",
		  });
		}
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor intenta nuevamente.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Iniciar Sesión - Base de datos Rocal</title>
        <meta name="description" content="Acceso seguro para Base de datos Rocal" />
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-8"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Acceso Administrativo
              </h1>
              <p className="text-blue-200">
                Base de datos Rocal
              </p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <Input
                    id="email"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-blue-200 focus:border-blue-400 transition-all"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  'Verificando...'
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default LoginPage;
