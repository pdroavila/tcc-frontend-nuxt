import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from "vue-toastification";

const authHash = ref(null);
const isAuthenticated = ref(false);

export function useAuth() {
  const router = useRouter();
  const toast = useToast();
  const config = useRuntimeConfig();

  // Verifica se o hash do candidato está no localStorage
  const checkAuthHash = () => {
    if (process.client) {
      authHash.value = localStorage.getItem('auth_hash');
    }
  };

  // Faz logout do candidato
  const logout = () => {
    if (process.client) {
      localStorage.removeItem('auth_hash');
      authHash.value = null;
    }
  };

  // Faz logout do admin
  const logoutAdmin = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    isAuthenticated.value = false;
  };

  // Verifica se o token de admin está válido
  const checkAuth = async () => {
    const accessToken = localStorage.getItem('access_token');

    if (!accessToken) {
      isAuthenticated.value = false;
      return false;
    }

    try {
      const response = await fetch(`${config.public.apiUrl}/admin/verificar-token/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        isAuthenticated.value = true;
        return true;
      } else {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const refreshed = await refreshAccessToken(refreshToken);
          if (refreshed) {
            isAuthenticated.value = true;
            return true;
          }
        }
        isAuthenticated.value = false;
        return false;
      }
    } catch (error) {
      console.error('Erro ao verificar o token:', error);
      isAuthenticated.value = false;
      return false;
    }
  };

    // Função para proteger as rotas
    const protectRoute = async () => {
      await checkAuth();
      if (!isAuthenticated.value) {
        router.push('/admin/login'); // Redireciona para a rota de login se não estiver autenticado
      }
    };
  
    // Função para redirecionar para /admin se o token já estiver setado ao acessar /admin/login
    const redirectIfAuthenticated = async () => {
      await checkAuth();
      if (isAuthenticated.value) {
        router.push('/admin'); // Redireciona para o painel de admin se já estiver autenticado
      }
    };

  const refreshAccessToken = async (refreshToken) => {
    try {
      const response = await fetch(`${config.public.apiUrl}/admin/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (response.status === 200) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access); // Armazena o novo token de acesso
        return true;
      } else {
        throw new Error('Falha ao atualizar o token');
      }
    } catch (error) {
      console.error('Erro ao fazer refresh do token:', error);
      toast.error('Sua sessão expirou, por favor faça login novamente.');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      router.push('/admin/login'); // Redireciona para a página de login
      return false;
    }
  };

  onMounted(async () => {
    await checkAuth(); // Verifica o token ao montar
  });

  return {
    authHash,
    checkAuthHash,
    isAuthenticated,
    logout,
    logoutAdmin,
    refreshAccessToken,
    protectRoute,
    redirectIfAuthenticated
  };
}
