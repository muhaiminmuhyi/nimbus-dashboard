import type { App } from 'vue';

export function setupGlobalErrorHandler(app: App) {
  // Vue error handler
  app.config.errorHandler = (err, instance, info) => {
    console.error('Vue Error:', err);
    console.error('Component Instance:', instance);
    console.error('Error Info:', info);
    // In production, send to error reporting service
    // reportError(err, { component: instance?.$?.type?.name, info });
  };

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Prevent default browser handling
    event.preventDefault();
    // In production, send to error reporting service
    // reportError(event.reason);
  });

  // Global error for non-Vue errors
  window.addEventListener('error', (event) => {
    console.error('Global Error:', event.error);
    // In production, send to error reporting service
    // reportError(event.error);
  });
}