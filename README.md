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

## Assumptions and Decisions

* **Authentication:** For the scope of this assignment, participants are identified using an `x-user-id` request header. This keeps the focus on the competition workflow without introducing a complete authentication system.
* **Payment:** The competition has an entry fee in the displayed data, but payment processing is not implemented in the assignment. Registration is therefore treated as a successful reservation in the demo. In a production implementation, registration would only be confirmed after successful payment verification.
* **Competition lifecycle:** Competition dates and lifecycle rules are controlled by the backend. The mobile application receives the relevant timestamps and uses them to display the current state and countdown, while the backend independently validates whether registration or submission actions are allowed.
* **Demo data:** A seed script is included intentionally so the application can be evaluated with a predictable competition and participant dataset without requiring manual database setup.
* **Submission storage:** Submissions currently store a `mediaUrl`. The assignment does not include a dedicated media-upload/storage service, so the URL represents the submission rather than implementing the complete upload pipeline.
* **Time handling:** Competition dates are stored as date values and lifecycle decisions are based on the server's current time rather than relying on a device's local clock for authorization.

### Major Technical Decisions

**Atomic registration**

Competition capacity is protected using an atomic MongoDB conditional update. The registration operation checks that the participant has not already registered and that available capacity remains, while adding the participant and incrementing the booked count in the same database operation.

This avoids a read-then-write race condition where multiple users registering at the same time could otherwise exceed the competition capacity.

**Database-level uniqueness**

Registrations and submissions use compound unique indexes for the competition and participant combination. This provides an additional database-level safeguard against duplicate records.

**Server-side business rules**

The backend is treated as the source of truth for actions that affect the competition. Registration is only accepted while registration is open and capacity is available, while submissions require both an open submission window and an existing registration.

The client therefore handles presentation and interaction, while the backend enforces the important business rules.

**Simple REST architecture**

A small Express REST API was used instead of introducing additional architectural layers. For the size and scope of the assignment, this keeps the implementation straightforward and makes the interaction between the React Native client and backend easy to understand.

---

## Trade-offs

### Simplified authentication

Using `x-user-id` instead of implementing authentication reduced the amount of infrastructure required for the assignment and allowed the competition workflow to be demonstrated quickly.

The trade-off is that this mechanism is not secure and cannot be used as real user authentication in production.

### Atomic update instead of transactions

The registration capacity problem can be solved with an atomic conditional update, so a full MongoDB transaction was not necessary for this workflow.

This keeps the local setup simpler. If the registration process were expanded to include several dependent database operations, payments, or other resources that must succeed or fail together, transactions and stronger consistency guarantees would become more appropriate.

### Seeded content instead of an admin system

The project includes a seed script with a complete competition rather than building an administration dashboard for creating and editing competitions.

This was a deliberate scope trade-off: the assignment could demonstrate the participant experience without spending significant development time on functionality that was not central to the requested workflow.

### URL-based submission instead of file uploads

The backend currently accepts a `mediaUrl` for submissions rather than handling file uploads directly.

This keeps the API and infrastructure lightweight, but a production application would need proper media storage, validation, access control, and potentially asynchronous processing.

### Limited client-side state management

The application uses React state and hooks directly rather than introducing a dedicated state-management library.

For the current application size, this keeps the code simpler. As the number of screens, API resources, and shared user state grows, a more structured data/state layer could become worthwhile.

---

## What I Would Improve With More Development Time

If this were developed beyond the assignment, I would prioritize the following:

1. **Real authentication and authorization**

   * Replace the demo `x-user-id` mechanism with authenticated accounts.
   * Add proper authorization so users can only access or modify their own registrations and submissions.

2. **Payment integration**

   * Connect the entry-fee flow to a payment provider.
   * Confirm registration only after verified payment.
   * Add webhook handling and idempotency so payment callbacks cannot create duplicate registrations.

3. **Actual media upload**

   * Allow participants to upload their performance directly from the application.
   * Store files in object storage rather than relying on a URL supplied by the client.
   * Add file-size/type validation and appropriate access controls.

4. **Competition management**

   * Build an admin interface for creating competitions, changing dates, managing capacity, reviewing submissions, and publishing results.

5. **Testing**

   * Add unit and integration tests for lifecycle rules, registration capacity, duplicate registration, submission eligibility, and concurrent registration attempts.
   * Add end-to-end tests covering the main mobile user journey.

6. **Production observability**

   * Add structured logging, error tracking, metrics, and monitoring.
   * Make database and API failures easier to diagnose.

7. **Security and API hardening**

   * Add authentication middleware, authorization checks, input validation, rate limiting, request-size limits, and appropriate security headers.

8. **Better mobile reliability**

   * Improve loading, retry, empty, and network-error states.
   * Handle intermittent connectivity more gracefully.
   * Add more robust API error handling instead of relying mainly on alerts.

9. **Scalability**

   * Move expensive or asynchronous work, such as media processing, to background jobs.
   * Introduce caching where appropriate.
   * Review database indexes and query patterns as the number of competitions and participants grows.

10. **Deployment and CI/CD**

    * Separate development, staging, and production environments.
    * Add automated testing and deployment checks through CI/CD.
    * Move configuration and secrets to appropriate production secret-management systems.

