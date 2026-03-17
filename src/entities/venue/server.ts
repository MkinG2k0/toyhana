/**
 * Server-only API. Import from here in Server Components / API routes
 * so that prisma/pg are not pulled into client bundle.
 */
export { getVenuesList } from "./api/get-venues-list"
