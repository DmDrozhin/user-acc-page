// Creates a map of asset filenames to their respective URLs
export function createAssetMap(
  globResult: Record<string, { default: string }>,
): Record<string, string> {
  return Object.fromEntries(
    Object.entries(globResult).map(([path, module]) => {
      const filename = path.split('/').pop();
      return [filename as string, module.default];
    }),
  );
}

// Returns the full path to an icon in the assets/images/ui folder
export function getIconPath(file?: string): string {
  if (!file) {
    return '';
  }
  return new URL(`../assets/icons/${file}`, import.meta.url).href;
}
export function getImagePath(file?: string): string {
  if (!file) {
    return '';
  }
  return new URL(`../assets/images/${file}`, import.meta.url).href;
}

// Phone number formatting function
export function formatPhone(num: string): string {
  if (!num) return '';
  // Remove all non-digit characters
  const digits = num.replace(/\D/g, '');
  // If local number (10 digits)
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8)}`;
  }
  // if international number (12 digits, starting with 380)
  if (digits.length === 12 && digits.startsWith('380')) {
    return `(${digits.slice(2, 5)}) ${digits.slice(5, 8)}-${digits.slice(8, 10)}-${digits.slice(10)}`;
  }
  return num; // fallback
}
/** Format card number by mask (mask using '#' as digit placeholders). Returns masked string trimmed. */
export function formatCardNumber(num: string, mask: string): string {
  const digits = num.replace(/\D/g, '').split('');
  let out = '';
  for (const ch of mask) {
    if (ch === '#') {
      if (digits.length === 0) break;
      out += digits.shift();
    } else {
      out += ch;
    }
  }
  return out.trim();
}
