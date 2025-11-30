// src/lib/utils.js

// shadcn-ui expects this helper
export function cn(...inputs) {
  return inputs.filter(Boolean).join(" ");
}

// You can keep these extra helpers as well:

export function clsx(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateKey(prefix = "key") {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}
