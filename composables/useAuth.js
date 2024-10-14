import { ref } from 'vue';

const authHash = ref(null);

export function useAuth() {
  const checkAuthHash = () => {
    if (process.client) {
      authHash.value = localStorage.getItem('auth_hash');
    }
  };

  const logout = () => {
    if (process.client) {
      localStorage.removeItem('auth_hash');
      authHash.value = null;
    }
  };

  return {
    authHash,
    checkAuthHash,
    logout
  };
}
