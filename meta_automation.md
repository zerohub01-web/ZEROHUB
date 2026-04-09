# Meta (WhatsApp) Automation Report

## 1. Overview
This report analyses the current **WhatsApp automation** implementation that uses **Meta's Cloud API** within the **ZERO** project. It covers configuration, code flow, status checking, and recommendations.

---

## 2. Environment Configuration (`.env`)
| Variable | Current Value | Meaning |
|---|---|---|
| `META_WHATSAPP_TOKEN` | *(empty)* | Bearer token for Meta Graph API. Required for any API call. |
| `META_WHATSAPP_PHONE_NUMBER_ID` | *(empty)* | The Meta‑assigned ID of the WhatsApp phone number. Required to send messages. |
| `META_WHATSAPP_SENDER_NUMBER` | `919746927368` | The **E.164** formatted phone number that should appear as the sender. |
| `META_WEBHOOK_VERIFY_TOKEN` | *(empty)* | Token used by Meta to verify the webhook during the GET challenge. |
| `META_APP_SECRET` | *(empty)* | Secret used to validate the `x‑hub‑signature‑256` header on incoming webhook POSTs. |

**Key observation:** Only the sender number is set. The token, phone‑number‑ID and verification token are missing, which means the automation is **not fully configured**.

---

## 3. Routing (`whatsapp.webhook.ts`)
```ts
export const whatsappWebhookRouter = Router();

// Verification endpoint – Meta calls this with GET parameters.
whatsappWebhookRouter.get("/webhook/whatsapp", verifyWhatsAppWebhook);

// Incoming message endpoint – Meta POSTs webhook events here.
whatsappWebhookRouter.post(
  "/webhook/whatsapp",
  whatsappWebhookLimiter,
  receiveWhatsAppWebhook
);
```
* The GET route validates `hub.mode`, `hub.verify_token` and returns the `hub.challenge`.
* The POST route validates the HMAC signature (`x‑hub‑signature‑256`) and then extracts incoming messages.

---

## 4. Controller (`whatsapp.controller.ts`)
| Function | Purpose |
|---|---|
| `verifyWhatsAppWebhook` | Handles the GET verification challenge. Returns **403** if the token does not match `env.metaWebhookVerifyToken`. |
| `receiveWhatsAppWebhook` | Validates the signature, extracts messages, acknowledges receipt (`{ received: true }`), and enqueues each message for asynchronous processing. |
| `sendWhatsAppFromApi` | Simple API endpoint that forwards a `phone` and `message` to `sendWhatsAppMessage`. |
| `getWhatsAppStatus` | Returns the result of `getWhatsAppAutomationStatus()` – a JSON object describing configuration health. |

---

## 5. Service Layer (`whatsapp.service.ts`)
### 5.1 Types
```ts
export interface WhatsAppAutomationStatus {
  provider: "meta_cloud_api";
  configured: boolean;
  tokenConfigured: boolean;
  phoneNumberIdConfigured: boolean;
  webhookVerifyTokenConfigured: boolean;
  expectedSenderE164: string;
  actualSenderE164: string | null;
  senderMatchesExpected: boolean;
  canSend: boolean;
  warnings: string[];
}
```
### 5.2 Core Functions
* **`resolveExpectedSenderE164()`** – Determines the expected sender number from env variables or falls back to `+919746927368`.
* **`fetchMetaPhoneProfile()`** – Calls `https://graph.facebook.com/v20.0/<PHONE_NUMBER_ID>?fields=id,display_phone_number,verified_name` using the token. Caches the result for 5 minutes.
* **`validateConfiguredSender()`** – Compares the **expected** sender (from env) with the **actual** sender returned by Meta. Returns a `SenderValidationResult` containing a possible warning.
* **`getWhatsAppAutomationStatus()`** – Aggregates configuration flags, sender validation, and warnings into a single status object.
* **`sendViaMetaCloud()`** – Performs the actual POST to `/<PHONE_NUMBER_ID>/messages` after sender validation.
* **`sendWhatsAppMessage()`** – Public wrapper that normalises the phone, trims the message, validates the phone format, and forwards to `sendViaMetaCloud`.

---

## 6. Message Flow (Incoming → Outgoing)
1. **Meta** POSTs a webhook to `/webhook/whatsapp`.
2. `receiveWhatsAppWebhook` verifies the HMAC signature using `META_APP_SECRET`.
3. `extractIncomingMessages` parses the payload and builds an array of `{ phone, message, timestamp }`.
4. Each message is **enqueued** via `whatsappQueue.service` (asynchronous background job).
5. The job runs `handleIncomingMessage`:
   * Stores the inbound message (`appendInboundChatMessage`).
   * Generates an AI reply (`generateReply`).
   * Sends the reply via `sendWhatsAppMessage` (Meta Cloud API).
   * Stores the outbound message (`appendOutboundChatMessage`).

---

## 7. Current Status (Based on `.env` & Code)
* **Token configured:** ❌ (empty)
* **Phone number ID configured:** ❌ (empty)
* **Webhook verify token configured:** ❌ (empty)
* **Expected sender:** `+919746927368`
* **Actual sender:** N/A (cannot be fetched without token/ID)
* **Automation configured:** **false** – the system cannot send messages until the missing env vars are supplied.
* **Warnings:**
  * `Meta WhatsApp token or phone number id is missing.`
  * `Sender mismatch` (cannot be evaluated yet).

---

## 8. Recommendations
1. **Populate missing environment variables** in `apps/api/.env` (and propagate to production):
   * `META_WHATSAPP_TOKEN` – the Graph API access token.
   * `META_WHATSAPP_PHONE_NUMBER_ID` – the ID of the registered WhatsApp number.
   * `META_WEBHOOK_VERIFY_TOKEN` – a secret you generate and register in the Meta developer console.
   * `META_APP_SECRET` – the app secret used for HMAC verification.
2. **Verify sender number** – ensure `META_WHATSAPP_SENDER_NUMBER` matches the number shown in the Meta Phone Profile (use the status endpoint after configuration).
3. **Test the webhook**:
   * Call `GET /webhook/whatsapp?hub.mode=subscribe&hub.verify_token=<your token>&hub.challenge=12345` – you should receive `12345`.
   * Send a test message from the Meta console and confirm the status endpoint (`GET /api/whatsapp/status`) reports `configured: true` and `canSend: true`.
4. **Add fallback handling** for missing configuration in production (e.g., return a clear error from the API instead of throwing uncaught exceptions).
5. **Secure the env file** – keep the token and secret out of version control (use `.gitignore` and secret management).

---

## 9. Quick Status Check (cURL example)
```bash
curl -s http://localhost:4000/api/whatsapp/status | jq
```
Expected JSON when fully configured:
```json
{
  "provider": "meta_cloud_api",
  "configured": true,
  "tokenConfigured": true,
  "phoneNumberIdConfigured": true,
  "webhookVerifyTokenConfigured": true,
  "expectedSenderE164": "+919746927368",
  "actualSenderE164": "+919746927368",
  "senderMatchesExpected": true,
  "canSend": true,
  "warnings": []
}
```

---

## 10. Conclusion
The codebase provides a solid foundation for Meta‑based WhatsApp automation, but the **environment configuration is incomplete**. By supplying the missing token, phone‑number‑ID, and verification secrets, the automation will become fully operational, allowing inbound messages to be processed, AI‑generated replies to be sent, and outbound messages to be tracked.

*Prepared on 2026‑04‑08.*
