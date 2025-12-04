// Creates a map of asset filenames to their respective URLs
export function createAssetMap(globResult: Record<string, { default: string }>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(globResult).map(([path, module]) => {
      const filename = path.split('/').pop();
      return [filename as string, module.default];
    })
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

// Phone number formatting function
export function formatPhone(num: string): string {
  if (!num) return '';

  // Clean the input number
  const raw = num.replace(/[^\d+]/g, '');

  // Extract pure digits
  const digits = raw.replace(/\D/g, '');

  // List of country formats
  // mask: X — digit placeholder
  const COUNTRY_FORMATS: Array<{
    code: string;
    name: string;
    mask: string;
    nationalLength: number;
  }> = [
    // Ukraine: +380 XX XXX XX XX
    {
      code: '380',
      name: 'Ukraine',
      nationalLength: 9,
      mask: '+38 (0XX) XXX-XX-XX'
    },
    // USA / Canada: +1 AAA BBB CCCC
    {
      code: '1',
      name: 'USA / Canada',
      nationalLength: 10,
      mask: '+1 (XXX) XXX-XXXX'
    },
    // United Kingdom (simple rule for +44)
    {
      code: '44',
      name: 'United Kingdom',
      nationalLength: 10,
      mask: '+44 XXXX XXX XXX'
    },
    // Poland +48 XXX XXX XXX
    {
      code: '48',
      name: 'Poland',
      nationalLength: 9,
      mask: '+48 XXX XXX XXX'
    }
  ];

  // Determine country by code
  const country = COUNTRY_FORMATS.find((c) => digits.startsWith(c.code));

  if (country) {
    const rest = digits.slice(country.code.length);

    // if length matches → format
    if (rest.length === country.nationalLength) {
      return applyMask(country.mask, rest);
    }
  }

  // Special case for Ukraine local format without country code
  // For example, Ukraine: 10 digits → (0XX) XXX-XX-XX
  if (digits.length === 10) {
    const uaLocalMask = '(0XX) XXX-XX-XX';
    return applyMask(uaLocalMask, digits);
  }
  // --- fallback to international E.164 format ---
  return '+' + digits;
}
// Apply mask using X as digit placeholders
function applyMask(mask: string, digits: string): string {
  let i = 0;
  return mask.replace(/X/g, () => digits[i++] ?? '');
}
