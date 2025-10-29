// lib/theme/shadows.js - custom subtle shadows
const base = "rgba(0,0,0,0.1)"

const shadows = [
  "none",
  `0px 1px 2px ${base}`,
  `0px 1px 3px ${base}, 0px 1px 2px ${base}`,
  `0px 2px 4px ${base}`,
  `0px 2px 6px ${base}`,
  `0px 3px 6px ${base}`,
  `0px 4px 8px ${base}`,
  `0px 4px 10px ${base}`,
  `0px 6px 12px ${base}`,
  `0px 8px 16px ${base}`,
  ...Array(15).fill(`0px 8px 16px ${base}`),
]

export default shadows


