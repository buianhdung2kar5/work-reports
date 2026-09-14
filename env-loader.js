/**
 * Browser Environment Loader (.env Parser)
 * Tự động đọc file .env ở thư mục gốc và nạp biến môi trường vào window.ENV_*
 */

(function (window) {
  'use strict';

  // Embed default environment variables (fallback when fetch is restricted or async)
  window.ENV_SUPABASE_URL = window.ENV_SUPABASE_URL || 'https://ftyqwpzekrxhzolbjrbq.supabase.co';
  window.ENV_SUPABASE_ANON_KEY = window.ENV_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ0eXF3cHpla3J4aHpvbGJqcmJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNTcxMDAsImV4cCI6MjEwNDkzMzEwMH0.JvolK_uEa7qFsRSPyJdJv7MX4qmIu_XDrMYhGlYu_2Y';

  window.envLoadingPromise = (async function loadEnvFile() {
    try {
      const response = await fetch('.env');
      if (!response.ok) return;

      const text = await response.text();
      const lines = text.split('\n');

      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const equalsIndex = trimmed.indexOf('=');
        if (equalsIndex !== -1) {
          const key = trimmed.substring(0, equalsIndex).trim();
          let value = trimmed.substring(equalsIndex + 1).trim();

          // Remove quotes if present
          if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.substring(1, value.length - 1);
          }

          if (key === 'SUPABASE_URL') window.ENV_SUPABASE_URL = value;
          if (key === 'SUPABASE_ANON_KEY') window.ENV_SUPABASE_ANON_KEY = value;
        }
      });

      console.log('🌱 Environment variables loaded from .env');
    } catch (e) {
      console.log('ℹ️ .env loaded using pre-configured values.');
    }
  })();
})(window);
