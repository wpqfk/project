import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './component/auth'; // AuthProvider import

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider> {/* AuthProvider로 App을 감쌈 */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
