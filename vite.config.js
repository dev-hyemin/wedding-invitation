import { defineConfig } from 'vite'

export default defineConfig({
  // GitHub Pages 배포 시 저장소 이름으로 변경 (예: '/wedding/')
  // 커스텀 도메인(CNAME) 사용 시 base: '/' 유지
  base: process.env.GITHUB_ACTIONS ? '/wedding-invitation/' : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/swiper')) return 'swiper'
          if (id.includes('node_modules/aos')) return 'aos'
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
