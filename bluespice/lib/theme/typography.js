// lib/theme/typography.js - includes tabular numbers for salary display

const baseFontFamily =
  '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'

const typography = {
  fontFamily: baseFontFamily,

  h1: { fontSize: "2.25rem", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.02em" },
  h2: { fontSize: "1.875rem", fontWeight: 600, lineHeight: 1.25, letterSpacing: "-0.01em" },
  h3: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.3, letterSpacing: "-0.01em" },
  h4: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.35 },
  h5: { fontSize: "1.125rem", fontWeight: 600, lineHeight: 1.4 },
  h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.4 },

  body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.6 },
  body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.5 },

  button: { fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.4, textTransform: "none", letterSpacing: "0.01em" },
  caption: { fontSize: "0.75rem", fontWeight: 400, lineHeight: 1.5, letterSpacing: "0.02em" },
  overline: { fontSize: "0.75rem", fontWeight: 500, lineHeight: 1.5, textTransform: "uppercase", letterSpacing: "0.1em" },

  subtitle1: { fontSize: "1rem", fontWeight: 500, lineHeight: 1.5 },
  subtitle2: { fontSize: "0.875rem", fontWeight: 500, lineHeight: 1.4 },

  // Salary and numeric alignment
  salary: {
    fontSize: "1.125rem",
    fontWeight: 600,
    lineHeight: 1.4,
    fontVariantNumeric: "tabular-nums",
  },
  numeric: {
    fontSize: "1rem",
    fontWeight: 500,
    lineHeight: 1.4,
    fontVariantNumeric: "tabular-nums",
  },
}

export default typography


