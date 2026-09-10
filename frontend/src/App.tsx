import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const App: React.FC = () => {
  const { loadFromStorage } = useAuthStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <>
      {/* Router will be added here */}
    </>
  );
};

export default App;
