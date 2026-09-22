# samyang — Web Client

Vue 2 + Vuex single-page client for **samyang**, a dating application: registration and
login, profile and photo management, swipe/match, messaging between matches, and an admin
panel for browsing and editing users.

Built solo as part of ChatGenie's developer evaluation — their process was to teach a
stack, then have candidates ship a real project on it. I learned Vue, Vuex and Apollo for
this build and came out of that process onto the team.

The Rails GraphQL API lives in **[samyang-back](https://github.com/Darkify19/samyang-back)**.
More of my work: **[portfolio](https://darkify19.github.io/carl-janzell-portfolio/)**.

> **Status:** source-available reference. The hosted API on Render is retired, so the
> deployed client has nothing to talk to — run both halves locally with the steps below.

## Stack

| | |
|---|---|
| Framework | Vue 2.7 (Vue CLI 5) |
| State | Vuex 3 |
| Routing | Vue Router 3 |
| GraphQL | Apollo Client 3 + vue-apollo, `apollo-upload-client` |
| Media | Cloudinary upload widget (`cloudinary-core`) |

## Features

- **Auth** — registration and session login against the GraphQL API
- **Profile** — editable profile fields, photo set with a selectable primary photo, capped at 5
- **Swipe** — like / skip mechanics driving the match model
- **Matches** — match list and messaging between matched users
- **Admin panel** — user list, user detail, and profile editing under `/admin`

## Running locally

Start [samyang-back](https://github.com/Darkify19/samyang-back) first — this client expects
a GraphQL endpoint at `http://localhost:3000/graphql` in development.

```bash
npm install
npm run serve     # dev server with hot reload
npm run build     # production bundle
npm run lint      # lint and autofix
```

## Configuration

Copy [`.env.example`](.env.example) to `.env.local` for development, or set the same
variables in your host's dashboard for a deployment.

| Variable | Notes |
|---|---|
| `VUE_APP_GRAPHQL_URI` | The samyang-back GraphQL endpoint. Defaults to `http://localhost:3000/graphql` |
| `VUE_APP_CLOUDINARY_CLOUD_NAME` | Cloudinary account for photo uploads |
| `VUE_APP_CLOUDINARY_UPLOAD_PRESET` | Must be an **unsigned** preset |

Photo uploads go straight from the browser to Cloudinary via
[`src/utils/cloudinaryUploader.js`](src/utils/cloudinaryUploader.js); the API only stores
the resulting references. Uploads are capped at 5 MB and restricted to JPG/PNG with cropping
enabled. Both Cloudinary values fall back to the original demo account, so point them at
your own to run it end to end.

Whatever origin you serve this from must be listed in the API's `CORS_ORIGINS`.
