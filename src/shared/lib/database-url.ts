/**
 * Нормализует sslmode в строке подключения pg, чтобы убрать предупреждение
 * о смене семантики в pg v9 и явно задать безопасный режим.
 * @see https://www.postgresql.org/docs/current/libpq-ssl.html
 */
export function normalizeDatabaseUrl(url: string): string {
  if (!url) return url
  if (/[?&]sslmode=(require|prefer|verify-ca)\b/i.test(url)) {
    return url.replace(/([?&])sslmode=(require|prefer|verify-ca)\b/gi, "$1sslmode=verify-full")
  }
  const hasSslMode = /[?&]sslmode=/i.test(url)
  if (hasSslMode) return url
  try {
    const parsed = new URL(url)
    const isLocalhost =
      parsed.hostname === "localhost" ||
      parsed.hostname === "127.0.0.1" ||
      parsed.hostname === ""
    const sslmode = isLocalhost ? "disable" : "verify-full"
    const separator = parsed.search ? "&" : "?"
    return `${url}${separator}sslmode=${sslmode}`
  } catch {
    return url
  }
}
