
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  const bootContainer = document.getElementById('boot-container');
  const debugConsole = document.getElementById('debug-console');

  if (!rootElement) {
    if (debugConsole) debugConsole.innerText = "FATAL: Root Element Missing";
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    // Hide booting UI once rendered
    if (bootContainer) {
      setTimeout(() => {
        bootContainer.style.opacity = '0';
        setTimeout(() => bootContainer.remove(), 500);
      }, 800);
    }
    if (debugConsole) debugConsole.innerText = "System_Link: Successful";
    
  } catch (error) {
    if (debugConsole) {
      debugConsole.style.color = '#ff2e2e';
      debugConsole.innerText = `MOUNT_ERROR: ${error.message}`;
    }
    console.error("Mount failed", error);
  }
};

// Start the engine
mountApp();
