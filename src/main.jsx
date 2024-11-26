import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext'; 
import { ChakraProvider } from '@chakra-ui/react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider> 
      <ChakraProvider>
      <App />
      </ChakraProvider>
    </AuthProvider>
  </StrictMode>,
);
