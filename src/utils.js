export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
