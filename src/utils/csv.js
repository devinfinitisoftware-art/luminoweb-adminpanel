// Lightweight CSV helpers: export and parse
export function exportCsvFromObjects(
  rows = [],
  columns = [],
  filename = "export.csv"
) {
  if (!Array.isArray(rows)) rows = [];

  const header = columns.map((c) => c.label || c.key).join(",");

  const lines = rows.map((r) => {
    return columns
      .map((c) => {
        const val = r[c.key];
        if (val === null || val === undefined) return "";
        if (typeof val === "object") {
          try {
            return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
          } catch {
            return "";
          }
        }
        const s = String(val).replace(/"/g, '""');
        if (s.search(/[",\n]/) >= 0) return `"${s}"`;
        return s;
      })
      .join(",");
  });

  const csv = [header, ...lines].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// Simple CSV parser (handles quoted fields and escaped quotes)
export function parseCsv(text) {
  const rows = [];
  let cur = "";
  let row = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const nxt = text[i + 1];

    if (inQuotes) {
      if (ch === '"') {
        if (nxt === '"') {
          cur += '"';
          i++; // skip escaped
        } else {
          inQuotes = false;
        }
      } else {
        cur += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        row.push(cur);
        cur = "";
      } else if (ch === "\r") {
        // ignore
      } else if (ch === "\n") {
        row.push(cur);
        rows.push(row);
        row = [];
        cur = "";
      } else {
        cur += ch;
      }
    }
  }

  if (cur !== "" || row.length) {
    row.push(cur);
    rows.push(row);
  }

  return rows;
}

export function parseCsvToObjects(text) {
  const rows = parseCsv(text || "");
  if (!rows || rows.length === 0) return [];
  const header = rows[0].map((h) => (h || "").trim());
  const data = rows.slice(1).map((r) => {
    const obj = {};
    for (let i = 0; i < header.length; i++) {
      obj[header[i] || `col${i}`] = r[i] !== undefined ? r[i] : "";
    }
    return obj;
  });
  return data;
}
