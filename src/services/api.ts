const API_BASE_URL = "https://cybermed-response.onrender.com";

export async function getIncidents() {
  const response = await fetch(`${API_BASE_URL}/incidents`);

  if (!response.ok) {
    throw new Error("Failed to fetch incidents");
  }

  return response.json();
}

export async function createIncident(incident: {
  title: string;
  description?: string;
  severity: string;
  status: string;
  source?: string;
}) {
  const response = await fetch(`${API_BASE_URL}/incidents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(incident),
  });

  if (!response.ok) {
    throw new Error("Failed to create incident");
  }

  return response.json();
}

export async function updateIncidentStatus(
  incidentId: number,
  status: string
) {
  const response = await fetch(
    `${API_BASE_URL}/incidents/${incidentId}/status?status=${encodeURIComponent(status)}`,
    {
      method: "PUT",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update incident status");
  }

  return response.json();
}