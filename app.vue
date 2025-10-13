<template>
  <div id="app">
    <!-- Skip to main content link para acessibilidade -->
    <a href="#main-content" class="skip-link">
      Pular para o conteúdo principal
    </a>

    <!-- Header com navegação e autenticação -->
    <Header />

    <!-- Landmark principal (um por página) -->
    <main id="main-content" tabindex="-1" class="min-h-screen">
      <NuxtPage />
    </main>

    <!-- Sistema de Notificações Toast -->
    <Toast />
  </div>
</template>

<script setup lang="ts">

// Configurar meta tags globais
useHead({
  htmlAttrs: {
    lang: 'pt-BR'
  },
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'format-detection', content: 'telephone=no' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})
</script>

<style>
html {
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Skip link para acessibilidade */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #0066ff;
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 0 0 4px 0;
  z-index: 100;
  font-weight: 600;
}

.skip-link:focus {
  top: 0;
  outline: 3px solid #ffcc00;
  outline-offset: 2px;
}

/* Melhorar foco visível para acessibilidade */
*:focus-visible {
  outline: 2px solid #0066ff;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Remover outline padrão mas manter para :focus-visible */
*:focus:not(:focus-visible) {
  outline: none;
}

/* Animações suaves */
* {
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

/* Melhorar contraste para texto */
.text-gray-600 {
  color: #4b5563;
}

.text-gray-500 {
  color: #6b7280;
}

/* Animação de entrada para notificações */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }

  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.fixed.top-4.right-4>div {
  animation: slideInRight 0.3s ease-out;
}
</style>