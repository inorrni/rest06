import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 프로젝트 페이지(GitHub Pages)이므로 빌드 시에만 base를 레포명으로,
// 로컬 dev는 '/' 로 둔다.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/rest06/' : '/',
}))
