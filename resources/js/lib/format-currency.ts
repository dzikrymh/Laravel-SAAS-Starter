/**
 * Dependency-free currency formatting built on `Intl.NumberFormat`.
 *
 * Currencies whose minor unit is not used in everyday pricing (e.g. IDR, where
 * `Rp 150.000` is written instead of `Rp 150.000,00`) are shown without
 * decimals by default.
 */

export interface FormatCurrencyOptions {
    /** ISO 4217 currency code (e.g. `USD`, `IDR`); defaults to `USD`. */
    currency?: string;
    /** BCP 47 locale (e.g. `en-US`, `id-ID`); defaults to `en-US`. */
    locale?: string | null;
    /** Override the number of fraction digits shown. */
    fractionDigits?: number;
}

const DEFAULT_CURRENCY = 'USD';
const DEFAULT_LOCALE = 'en-US';

const WHOLE_UNIT_CURRENCIES = ['IDR', 'JPY', 'KRW', 'VND'];

/**
 * Format an amount in major units (e.g. dollars, rupiah) as a localized
 * currency string. Falls back to `en-US` / `USD` when the locale or currency is
 * invalid so a bad preference can never make the formatter throw.
 */
export function formatCurrency(
    amount: number,
    options: FormatCurrencyOptions = {},
): string {
    const currency = (options.currency ?? DEFAULT_CURRENCY).toUpperCase();
    const fractionDigits =
        options.fractionDigits ??
        (WHOLE_UNIT_CURRENCIES.includes(currency) ? 0 : undefined);

    const numberFormatOptions: Intl.NumberFormatOptions = {
        style: 'currency',
        currency,
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
    };

    try {
        return new Intl.NumberFormat(
            options.locale || DEFAULT_LOCALE,
            numberFormatOptions,
        ).format(amount);
    } catch {
        return new Intl.NumberFormat(DEFAULT_LOCALE, {
            ...numberFormatOptions,
            currency: DEFAULT_CURRENCY,
        }).format(amount);
    }
}
