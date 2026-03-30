# Share Link Auth Header Contract

## Purpose

Define how `sitio-backend` distinguishes auth-proxy internal user requests from share-link authenticated requests where internal user headers are absent.

## Request Header Rules

- Internal staff requests:
  - Auth proxy forwards user headers (example: `x-auth-user-id`, `x-auth-user-email`, `x-auth-user-roles`)
  - `x-share-link-authenticated` must be absent or `false`
- Share-link requests:
  - `x-share-link-authenticated: true`
  - Internal user headers are absent
  - Share-link token is sent as `Authorization: Bearer <share_link_token>` (or secure cookie if later standardized)

## Middleware Behavior

- If `x-share-link-authenticated: true`:
  - Validate presence of share-link token
  - Resolve token hash to `ShareLink`
  - Reject if revoked/expired/unknown with `401`
  - Attach share-link auth context to request (`scopeType`, `tripId|schoolId`, `shareLinkId`)
- If `x-share-link-authenticated` absent/false:
  - Require auth-proxy user headers for protected internal endpoints
  - Reject missing identity with `401`

## Security Constraints

- Header is trusted only from known proxy network path.
- Backend should reject direct public traffic attempting to spoof trusted proxy headers.
- Share-link authenticated routes must return status-only payloads.

## Error Contract

- `401 Unauthorized`: invalid token, missing token in share-link mode, or missing proxy identity for internal mode
- `403 Forbidden`: scope mismatch or route not allowed for share-link mode
- `410 Gone`: valid token format but link expired or revoked (optional; can be mapped to `401` if policy prefers)
