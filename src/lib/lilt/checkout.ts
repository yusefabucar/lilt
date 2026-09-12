import { createServerFn } from "@tanstack/react-start";

type StripeSession = {
  id?: string;
  url?: string | null;
  status?: string | null;
  payment_status?: string | null;
  mode?: string | null;
  error?: { message?: string };
};

async function stripeForm(path: string, secret: string, body?: URLSearchParams): Promise<StripeSession> {
  const res = await fetch(`https://api.stripe.com/v1/${path}`, {
    method: body ? "POST" : "GET",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body?.toString(),
  });
  return (await res.json()) as StripeSession;
}

function safeOrigin(raw: string): string | null {
  try {
    const u = new URL(raw);
    if (u.protocol !== "http:" && u.protocol !== "https:") return null;
    return u.origin;
  } catch {
    return null;
  }
}

export const startPinpointCheckout = createServerFn({ method: "POST" })
  .validator((input: { origin: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true; url: string } | { ok: false; error: string }> => {
    const secret = process.env.STRIPE_SECRET_KEY?.trim();
    if (!secret) {
      return {
        ok: false,
        error:
          "Card checkout is live at $0.99 a month, but no Stripe account is attached yet — that’s the link to your bank. Connect Stripe to start deposits.",
      };
    }
    const origin = safeOrigin(data.origin);
    if (!origin) return { ok: false, error: "Could not start checkout from this page." };

    const body = new URLSearchParams();
    body.set("mode", "subscription");
    body.set("success_url", `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`);
    body.set("cancel_url", `${origin}/?checkout=cancel`);
    body.set("allow_promotion_codes", "false");
    body.set("billing_address_collection", "auto");
    body.set("line_items[0][quantity]", "1");
    body.set("line_items[0][price_data][currency]", "usd");
    body.set("line_items[0][price_data][unit_amount]", "99");
    body.set("line_items[0][price_data][product_data][name]", "ACCENTIFY Pinpoint");
    body.set(
      "line_items[0][price_data][product_data][description]",
      "Neighborhood-level accent reads. $0.99 per month.",
    );
    body.set("line_items[0][price_data][recurring][interval]", "month");
    body.set("line_items[0][price_data][recurring][interval_count]", "1");

    const session = await stripeForm("checkout/sessions", secret, body);
    if (!session.url) {
      return { ok: false, error: session.error?.message || "Stripe did not return a checkout page." };
    }
    return { ok: true, url: session.url };
  });

export const confirmPinpointCheckout = createServerFn({ method: "POST" })
  .validator((input: { sessionId: string }) => input)
  .handler(async ({ data }): Promise<{ ok: true } | { ok: false; error: string }> => {
    const secret = process.env.STRIPE_SECRET_KEY?.trim();
    if (!secret) return { ok: false, error: "Stripe is not attached." };
    const id = data.sessionId.trim();
    if (!id.startsWith("cs_")) return { ok: false, error: "That checkout session is not valid." };

    const session = await stripeForm(`checkout/sessions/${encodeURIComponent(id)}`, secret);
    const paid = session.payment_status === "paid" || session.status === "complete";
    if (!paid) {
      return { ok: false, error: "Payment did not clear. Pinpoint stays locked." };
    }
    return { ok: true };
  });
