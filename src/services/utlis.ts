// src/services/utils.ts

export function buildQuery(params?: Record<string, string | number | boolean>): string {
  if (!params) return '';
  const entries: [string, string][] = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== '')
    .flatMap(([k, v]) =>
      Array.isArray(v) ? v.map(x => [k, String(x)] as [string, string]) : [[k, String(v)]],
    );
  return entries.length === 0 ? '' : '?' + new URLSearchParams(entries).toString();
}

export function toFormData(
  obj: Record<string, string | number | boolean | File | null | undefined>,
) {
  const fd = new FormData();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined || v === null) return;
    if (Array.isArray(v)) {
      v.forEach(x => fd.append(k, String(x)));
    } else {
      fd.append(k, v instanceof File ? v : String(v));
    }
  });
  return fd;
}
