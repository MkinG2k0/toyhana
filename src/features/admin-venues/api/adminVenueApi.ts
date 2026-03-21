export const approveVenue = async (id: string): Promise<void> => {
  const res = await fetch(`/api/venues/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isApproved: true }),
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.error ?? "Ошибка одобрения зала")
  }
}
