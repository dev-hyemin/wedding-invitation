/**
 * CSS 커스텀 프로퍼티에서 색상을 읽어옵니다.
 * 색상은 variables.css 한 곳에서만 관리합니다.
 */
const _css = getComputedStyle(document.documentElement)
const get  = name => _css.getPropertyValue(name).trim()

export const theme = {
  primary:     get('--color-primary'),
  primaryDark: get('--color-primary-dark'),
  secondary:   get('--color-secondary'),
  accent:      get('--color-accent'),
  surface:     get('--color-surface'),

  // 파티클용 색상 배열 (variables.css --particle-* 에서 읽음)
  particles: [
    get('--particle-1'),
    get('--particle-2'),
    get('--particle-3'),
  ],

  // 불투명 색상만 필요한 곳 (confetti, burst)
  solid: [
    get('--color-primary'),
    get('--color-accent'),
    get('--color-primary-dark'),
    '#ffffff',
  ],
}
