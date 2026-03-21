export const approveVenuePlacementRequest = async (id: string): Promise<void> => {
  const res = await fetch(`/api/venue-placement-requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "approve" }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? "Ошибка одобрения заявки")
  }
}

export const rejectVenuePlacementRequest = async (
  id: string,
  adminComment: string
): Promise<void> => {
  const res = await fetch(`/api/venue-placement-requests/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "reject", adminComment }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? "Ошибка отклонения заявки")
  }
}
