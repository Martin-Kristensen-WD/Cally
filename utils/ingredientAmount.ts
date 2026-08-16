export const parseAmount = (str: string): number | null => {
  const s = str.trim()
  if (!s) return null
  const mixed = s.match(/^(\d+)\s+(\d+)\/(\d+)$/)
  if (mixed) return +mixed[1] + +mixed[2] / +mixed[3]
  const fraction = s.match(/^(\d+)\/(\d+)$/)
  if (fraction) return +fraction[1] / +fraction[2]
  const n = parseFloat(s.replace(',', '.'))
  return isNaN(n) ? null : n
}

// "Juice + rosiner" / "Banan & kaffe latte" -> two parts — a "+" or "&" with
// space on both sides bundles multiple distinct foods into one entry, so
// each part should be listed separately. Only split on a space-padded
// delimiter (not e.g. "Smelteost +45", a Danish cheese fat-content label) so
// product names with an unspaced "+"/"&" aren't torn apart.
export const splitCompoundItem = (text: string): string[] =>
  text.split(/\s+[+&]\s+/).map(part => part.trim()).filter(Boolean)

export const formatAmount = (value: number): string => {
  const whole = Math.floor(value)
  const dec = value - whole
  const fractions: [number, string][] = [[0.25, '¼'], [0.33, '⅓'], [0.5, '½'], [0.67, '⅔'], [0.75, '¾']]
  for (const [f, sym] of fractions) {
    if (Math.abs(dec - f) < 0.07) return whole > 0 ? `${whole} ${sym}` : sym
  }
  const rounded = Math.round(value * 10) / 10
  return rounded % 1 === 0 ? String(rounded) : rounded.toFixed(1)
}
