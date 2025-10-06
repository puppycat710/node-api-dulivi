export default function round(value, precision = 2) {
  const multiplier = Math.pow(10, precision);
  return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}