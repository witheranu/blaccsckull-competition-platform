# Blaccsckull Competition Details


## How to Run it

1. Start MongoDB locally, or set `MONGODB_URI` to an Atlas connection string.
2. Copy `server/.env.example` to `server/.env` and adjust it if needed.
3. Run `npm install`, then `npm run seed` and `npm run server`.
4. In a second terminal run `npm run mobile`. In Expo, set `EXPO_PUBLIC_API_URL` to your computer's LAN IP (for example, `http://192.168.1.5:4000/api`). Android emulators may use `http://10.0.2.2:4000/api`.

The app sends an `x-user-id` header. Change `EXPO_PUBLIC_DEMO_USER_ID` to test a different participant.

## API

- `GET /api/competitions/:slug` returns details plus the requesting user's state.
- `POST /api/competitions/:id/register` atomically reserves one place.
- `POST /api/competitions/:id/submissions` accepts a submission only for registered users during the submission window.

## Assumptions and decisions

- Registration is free to reserve in this demo; a production checkout should call the registration endpoint only after a payment provider confirms payment.
- Capacity is guarded by a MongoDB transaction and a conditional update, so parallel registrations cannot oversubscribe the competition.
- Dates are stored in UTC and all lifecycle decisions are made by the server. The app only renders the server-provided state.
- The included seed content is intentional demo data; the UI never hardcodes competition facts.

## Further production work

Add authenticated identities, payment webhooks with idempotency keys, rate limiting, a queue for media processing, observability, and replica-set/transaction monitoring.
