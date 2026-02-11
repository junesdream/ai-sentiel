"use server";

export async function askAI(prompt: string) {
  const apiKey = process.env.GOOGLE_AI_KEY?.trim();
  if (!apiKey) return "SYSTEM_ERROR: Key fehlt.";

  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return `API_ERROR: ${data.error?.message || "Zugriff verweigert"}`;
    }

    return data.candidates[0].content.parts[0].text;
    
  } catch (error: any) {
    return `FEHLER: Verbindung fehlgeschlagen.`;
  }
}