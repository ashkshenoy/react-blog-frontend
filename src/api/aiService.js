const API_BASE = "http://localhost:8000";

export async function summarizeContent(content) {
  const res = await fetch(`${API_BASE}/summarize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  const data = await res.json();
  return data.summary;
}

export async function generateTags(content) {
  const res = await fetch(`${API_BASE}/generate-tags`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  const data = await res.json();
  return data.tags;
}