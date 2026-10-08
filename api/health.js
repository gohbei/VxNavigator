/**
 * Health check endpoint for My Vaccine Guide SG / service diagnostic.
 * Reports MCP_PATH, SERVER_INFO and DATASET, and service readiness.
 */

import { MCP_PATH, SERVER_INFO, DATASET, MCP_RESOURCE } from './_lib/mcp-server.js';

export { MCP_PATH, SERVER_INFO, DATASET, MCP_RESOURCE };

export default async function handler(req, res) {
  const ltaKey = process.env.LTA_API_KEY || process.env.LTA_KEY || process.env.DATAMALL_KEY || '';
  const keyConfigured = Boolean(ltaKey && ltaKey.trim().length > 0);
  const geminiConfigured = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);

  let ltaAnswered = false;
  let ltaStatusCode = null;
  let ltaError = null;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const headers = {
      'Accept': 'application/json',
    };
    if (keyConfigured) {
      headers['AccountKey'] = ltaKey;
    }

    const response = await fetch('https://datamall2.mytransport.sg/ltaodataservice/TaxiAvailability', {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    ltaAnswered = true;
    ltaStatusCode = response.status;
  } catch (err) {
    ltaAnswered = false;
    ltaError = err instanceof Error ? err.name : 'NetworkError';
  }

  const payload = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'My Vaccine Guide SG Diagnostic',
    MCP_PATH,
    MCP_RESOURCE,
    SERVER_INFO,
    DATASET,
    keyConfigured,
    geminiConfigured,
    ltaAnswered,
    ltaStatusCode,
    ltaError: ltaError ? String(ltaError) : null,
  };

  if (res && typeof res.status === 'function') {
    return res.status(200).json(payload);
  }
  return payload;
}
