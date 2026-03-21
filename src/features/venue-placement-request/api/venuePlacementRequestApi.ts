export const submitVenuePlacementRequest = async (
  description: string
): Promise<void> => {
  const res = await fetch("/api/venue-placement-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? "Ошибка отправки заявки")
  }
}
