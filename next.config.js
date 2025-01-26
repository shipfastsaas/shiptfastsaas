/** @type {import('next').NextConfig} */
const nextConfig = {
  // Désactiver la génération statique pour les routes API
  experimental: {
    // Cette option permet d'éviter la pré-construction des routes API
    workerThreads: false,
    // Désactiver la génération statique par défaut
    isrMemoryCacheSize: 0,
  },
}

module.exports = nextConfig
