/**
 * Browser Environment Loader (.env Parser)
 * Tự động đọc file .env ở thư mục gốc và nạp biến môi trường vào window.ENV_*
 */

(function (window) {
  'use strict';

  window.ENV_SUPABASE_URL = window.ENV_SUPABASE_URL || '';
  window.ENV_SUPABASE_ANON_KEY = window.ENV_SUPABASE_ANON_KEY || '';

  async function loadEnvFile() {
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
      console.log('ℹ️ .env file not loaded directly via fetch, using default/embedded fallback.');
    }
  }

  // Load env synchronously or immediately upon script execution
  loadEnvFile();
})(window);
