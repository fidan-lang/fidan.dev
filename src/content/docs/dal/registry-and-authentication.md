---
title: "Registry, authentication and service API"
description: "Public package reads, scoped publishing credentials, sparse index and service boundaries."
summary: "Public package reads, scoped publishing credentials, sparse index and service boundaries."
order: 535
---

# Registry, authentication and service API

## Public installation and ownership

The official DAL public registry is intended to remain free to use. Ordinary search, index resolution and package downloads do not require authentication. Package authors retain the rights granted by their chosen licenses; DAL does not replace them with a registry-wide package license.

Both Fidan and the DAL implementation use unmodified Apache-2.0. Commercial software development, redistribution and independently hosted registries remain permitted. Software rights, branding and acceptable use of the official service are separate. See the DAL repository's [LICENSE](https://github.com/fidan-lang/dal/blob/main/LICENSE), [trademark policy](https://github.com/fidan-lang/dal/blob/main/TRADEMARKS.md) and [registry service terms](https://github.com/fidan-lang/dal/blob/main/REGISTRY_TERMS.md). The service terms include clauses requiring legal review before publication; a Markdown file is not automatically an enforceable agreement.

## Selecting a registry

The CLI uses `--registry`, then `FIDAN_DAL_REGISTRY`, then the official `https://api.dal.fidan.dev`. Registry URLs require HTTPS, except literal loopback endpoints used for local testing. Userinfo, query credentials and fragments are rejected. Meaningful URL path prefixes are preserved; credentials are scoped to the canonical registry identity and must not follow unrelated redirects.

```bash
fidan dal search example --registry http://127.0.0.1:18080
fidan dal info example --registry http://127.0.0.1:18080
```

These commands require a running disposable registry with the named fixture package. They are local integration examples, not claims that an `example` package is published officially.

## Authentication and tokens

Create an account and complete email verification through the registry UI. Generate a scoped API token there, then run `fidan dal login` and enter it at the prompt. The CLI verifies the token before saving it in the OS credential store for that registry. `fidan dal whoami` checks the current identity; `fidan dal logout` clears the stored credential.

In CI, supply `FIDAN_DAL_API_TOKEN` through the CI secret mechanism. Avoid command-line tokens, committed `.env` files and tokens in URLs. A custom registry must not receive an unrelated official-registry credential. Token scopes and package ownership both matter; a token is not permission to publish into another account's package.

The server stores a SHA-256 token digest and display prefix, not the raw token. The raw token is returned once on creation. Token creation/revocation requires a verified interactive session; API-token authentication cannot manufacture a new interactive session. Browser mutations also enforce allowed Origin independently of CORS.

## HTTP API families

Paths below are relative to the registry API origin. Public metadata endpoints return JSON; `/index/{name}` returns sparse NDJSON.

| Family         | Endpoints and behavior                                                                                                                                                                    |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Discovery      | `GET /packages`, `GET /packages/{name}`, `GET /search?q=...`; paginated catalog/search                                                                                                    |
| Versions       | `GET /packages/{name}/versions`, `GET /packages/{name}/versions/{version}`                                                                                                                |
| Sparse index   | `GET /index/{name}`; version, dependencies, checksum, yank state and optional compiler constraint                                                                                         |
| Archive        | `GET /packages/{name}/versions/{version}/download`; anonymous 307 redirect to a temporary signed object URL                                                                               |
| Publish        | `POST /packages/{name}/publish`; authenticated multipart upload, validated manifest/archive and ownership/scope checks                                                                    |
| Yank state     | `PUT /packages/{name}/versions/{version}/yank` or `/unyank`; authenticated authorized mutation                                                                                            |
| Public owners  | `GET /packages/{name}/owners`                                                                                                                                                             |
| Ownership      | `POST /packages/{name}/owners/invite`, `DELETE /packages/{name}/owners/{username}`, `POST /packages/{name}/transfer`; authorization required                                              |
| Invitations    | `GET /owners/invites`, `POST /owners/invites/{id}/accept` or `/decline`; verified session and invitation/role checks                                                                      |
| Public users   | `GET /users/{username}`, `GET /users/{username}/packages`; private account fields are not a public profile                                                                                |
| Profile        | `PATCH /users/me/profile`; authenticated profile update                                                                                                                                   |
| Tokens         | `GET /tokens`, `POST /tokens`, `DELETE /tokens/{id}`; verified-session management                                                                                                         |
| Authentication | `POST /auth/register`, `/auth/login`, `/auth/logout`, `/auth/refresh`, `/auth/resend-verification`, `/auth/forgot-password`, `/auth/reset-password`; `GET /auth/verify-email`, `/auth/me` |
| Health         | `GET /health` for process liveness, `GET /readyz` for bounded database readiness                                                                                                          |
| Administration | `DELETE /admin/packages/{name}` is an administrator-only operation, not a general package-owner delete API                                                                                |

The server route/DTO source in `dal-server/src/routes` is authoritative for request bodies and response fields. Frontend session endpoints and publisher API tokens have different authentication requirements; do not substitute one for the other. Errors use HTTP status plus structured DAL error responses, not a successful empty result.

## Integrity, caching and yanks

The client verifies archive SHA-256 against index metadata before extraction, validates package/version/compiler identity, bounds decompression and rejects traversal, links and duplicate paths. Installation stages beside the destination before replacement. A checksum supplied by a trusted HTTPS registry is integrity evidence; it is not a separate publisher signature.

Yanking prevents new normal resolution but preserves immutable downloads and valid checksum-bearing lockfile use. A legacy checksum-free lock does not bypass the yank policy. Local caching and CI automation remain supported. A signed archive URL expires after 60 seconds and is a bearer capability until then; do not log or share it. The redirect is private/no-store and no-referrer; that does not prohibit caching verified archive bytes locally.

## Self-hosting and abuse protection

DAL uses PostgreSQL, S3-compatible storage, Cognito-compatible authentication, optional SQS worker processing and a SvelteKit frontend. Use the repository's `.env.example` and disposable `docker-compose.test.yml`; never copy production credentials into tests. The local runner `node scripts/test-local.mjs --with-cognito --e2e` clears cloud credential sources and targets loopback services.

Public metadata/download issuance currently has no general application-wide bulk-download quota. Auth-route limits do not protect every public route, and edge rules on the API cannot control traffic to a signed R2 S3 hostname after redirect. CORS, robots.txt and this documentation are not anti-scraping controls. No production configuration is changed by local tests.

## JSON request fields

| Operation           | Fields                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------ |
| Register            | `username`, `email`, `password`; optional `display_name`                                   |
| Login               | `username`, `password`                                                                     |
| Resend verification | optional `email` / `username`; validation chooses the supported identity                   |
| Refresh             | refresh cookie for browser use, or a `refresh_token` body in the supported non-cookie flow |
| Forgot password     | `email`; response does not disclose whether the account exists                             |
| Reset password      | verification `token`, `new_password`                                                       |
| Owner invite        | `username`; optional `role`: `owner` or `collaborator` (default)                           |
| Ownership transfer  | `to_username`                                                                              |
| Token create        | `name`; optional `expires_in` in seconds and `scopes`                                      |
| Profile patch       | optional `display_name`, `bio`, `website`, `avatar_url`                                    |

Use browser-managed HttpOnly cookies for the interactive frontend session; do not copy refresh tokens into package manifests. Publishing requires exactly one multipart field named `archive`, not a JSON object containing arbitrary storage keys. Server validation and transactions remain authoritative even when the frontend validates the same fields for usability.

## Complete route catalog

Generated from the exact selected server route declarations. Authentication and role requirements above still apply; listing an endpoint is not permission to invoke it.

<!-- dal-routes:start -->

<!-- prettier-ignore -->
| Method | Path | Server source |
| --- | --- | --- |
| DELETE | `/admin/packages/{name}` | `admin.rs` |
| POST | `/auth/forgot-password` | `auth.rs` |
| POST | `/auth/login` | `auth.rs` |
| POST | `/auth/logout` | `auth.rs` |
| GET | `/auth/me` | `auth.rs` |
| POST | `/auth/refresh` | `auth.rs` |
| POST | `/auth/register` | `auth.rs` |
| POST | `/auth/resend-verification` | `auth.rs` |
| POST | `/auth/reset-password` | `auth.rs` |
| GET | `/auth/verify-email` | `auth.rs` |
| GET | `/health` | `health.rs` |
| GET | `/index/{name}` | `index.rs` |
| GET | `/owners/invites` | `owners.rs` |
| POST | `/owners/invites/{id}/accept` | `owners.rs` |
| POST | `/owners/invites/{id}/decline` | `owners.rs` |
| GET | `/packages` | `packages.rs` |
| GET | `/packages/{name}` | `packages.rs` |
| GET | `/packages/{name}/owners` | `owners.rs` |
| DELETE | `/packages/{name}/owners/{username}` | `owners.rs` |
| POST | `/packages/{name}/owners/invite` | `owners.rs` |
| POST | `/packages/{name}/publish` | `versions.rs` |
| POST | `/packages/{name}/transfer` | `owners.rs` |
| GET | `/packages/{name}/versions` | `versions.rs` |
| GET | `/packages/{name}/versions/{version}` | `versions.rs` |
| GET | `/packages/{name}/versions/{version}/download` | `versions.rs` |
| PUT | `/packages/{name}/versions/{version}/unyank` | `versions.rs` |
| PUT | `/packages/{name}/versions/{version}/yank` | `versions.rs` |
| GET | `/readyz` | `health.rs` |
| GET | `/search` | `search.rs` |
| GET | `/tokens` | `tokens.rs` |
| POST | `/tokens` | `tokens.rs` |
| DELETE | `/tokens/{id}` | `tokens.rs` |
| GET | `/users/{username}` | `users.rs` |
| GET | `/users/{username}/packages` | `users.rs` |
| PATCH | `/users/me/profile` | `users.rs` |

<!-- dal-routes:end -->

Token scopes are `publish:new`, `publish:update`, `yank`, `owner` and `user:write`. The default token scopes cover the two publishing operations and yanking; they do not implicitly grant ownership or profile mutation. Paginated list queries default to page 1 and 25 entries, clamp the page to at least 1 and page size to 1–100, and compute offsets without narrow-integer overflow.
