/**
 * Normalizes city names by removing state suffixes, parenthesis, and fixing capitalization.
 * Example: "Santo Antônio da Patrulha - RS" -> "Santo Antônio da Patrulha"
 */
export const normalizeCity = (rawCity: string): string => {
  if (!rawCity) return '';

  // 1. Remove anything inside parentheses (e.g., "(RS)")
  let cleaned = rawCity.replace(/\s*\(.*?\)\s*/g, '');

  // 2. Remove state suffixes like " - RS", "/SC", " RS" at the end of string
  // Regex explanation:
  // \s* matches optional whitespace
  // [-/]? matches optional separator
  // \s* matches optional whitespace
  // [A-Z]{2} matches exactly 2 uppercase letters (State code)
  // $ ensures it's at the end of the string
  cleaned = cleaned.replace(/\s*[-/]?\s*[A-Z]{2}$/i, '');

  // 3. Trim whitespace
  cleaned = cleaned.trim();

  // 4. Title Case (Basic implementation)
  return cleaned.replace(/\w\S*/g, (txt) => {
    // Keep 'da', 'de', 'do', 'dos' lowercase if not at start
    const lowers = ['da', 'de', 'do', 'das', 'dos', 'e'];
    if (lowers.includes(txt.toLowerCase()) && txt !== cleaned.split(' ')[0]) {
        return txt.toLowerCase();
    }
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};

/**
 * Normalizes interest areas from a comma-separated string into an array.
 * Example: "Administrativa, Comercial, Financeira" -> ['Administrativa', 'Comercial', 'Financeira']
 */
export const normalizeInterests = (rawString: string): string[] => {
  if (!rawString) return [];

  return rawString
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0); // Remove empty strings
};

export const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const formatDate = (dateString: string) => {
    try {
        return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (e) {
        return dateString;
    }
};