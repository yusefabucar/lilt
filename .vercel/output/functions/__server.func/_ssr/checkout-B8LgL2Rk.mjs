import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-B8LgL2Rk.js
async function stripeForm(path, secret, body) {
	return await (await fetch(`https://api.stripe.com/v1/${path}`, {
		method: body ? "POST" : "GET",
		headers: {
			Authorization: `Bearer ${secret}`,
			"Content-Type": "application/x-www-form-urlencoded"
		},
		body: body?.toString()
	})).json();
}
function safeOrigin(raw) {
	try {
		const u = new URL(raw);
		if (u.protocol !== "http:" && u.protocol !== "https:") return null;
		return u.origin;
	} catch {
		return null;
	}
}
var startPinpointCheckout_createServerFn_handler = createServerRpc({
	id: "67144286fdde82237a83ad3ea269ff4933f513a32b436772cbf45f6317c04f57",
	name: "startPinpointCheckout",
	filename: "src/lib/lilt/checkout.ts"
}, (opts) => startPinpointCheckout.__executeServer(opts));
var startPinpointCheckout = createServerFn({ method: "POST" }).validator((input) => input).handler(startPinpointCheckout_createServerFn_handler, async ({ data }) => {
	const secret = process.env.STRIPE_SECRET_KEY?.trim();
	if (!secret) return {
		ok: false,
		error: "Card checkout is live at $0.99 a month, but no Stripe account is attached yet — that’s the link to your bank. Connect Stripe to start deposits."
	};
	const origin = safeOrigin(data.origin);
	if (!origin) return {
		ok: false,
		error: "Could not start checkout from this page."
	};
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
	body.set("line_items[0][price_data][product_data][description]", "Neighborhood-level accent reads. $0.99 per month.");
	body.set("line_items[0][price_data][recurring][interval]", "month");
	body.set("line_items[0][price_data][recurring][interval_count]", "1");
	const session = await stripeForm("checkout/sessions", secret, body);
	if (!session.url) return {
		ok: false,
		error: session.error?.message || "Stripe did not return a checkout page."
	};
	return {
		ok: true,
		url: session.url
	};
});
var confirmPinpointCheckout_createServerFn_handler = createServerRpc({
	id: "16096b5d8c07a59148c4cd218696b3f476c326ca2b33f7d4869c5a114663c8f5",
	name: "confirmPinpointCheckout",
	filename: "src/lib/lilt/checkout.ts"
}, (opts) => confirmPinpointCheckout.__executeServer(opts));
var confirmPinpointCheckout = createServerFn({ method: "POST" }).validator((input) => input).handler(confirmPinpointCheckout_createServerFn_handler, async ({ data }) => {
	const secret = process.env.STRIPE_SECRET_KEY?.trim();
	if (!secret) return {
		ok: false,
		error: "Stripe is not attached."
	};
	const id = data.sessionId.trim();
	if (!id.startsWith("cs_")) return {
		ok: false,
		error: "That checkout session is not valid."
	};
	const session = await stripeForm(`checkout/sessions/${encodeURIComponent(id)}`, secret);
	if (!(session.payment_status === "paid" || session.status === "complete")) return {
		ok: false,
		error: "Payment did not clear. Pinpoint stays locked."
	};
	return { ok: true };
});
//#endregion
export { confirmPinpointCheckout_createServerFn_handler, startPinpointCheckout_createServerFn_handler };
