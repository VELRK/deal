export type PincodeRange = { from: number; to: number; message?: string };
export type PincodeExtraRange = PincodeRange & {
  extra_charge: number;
  free_above: number;
};

export type PincodeShipSettings = {
  shipping_charge?: number;
  free_shipping_above?: number;
  non_delivery_pincodes?: PincodeRange[];
  pincode_extra_charge_ranges?: PincodeExtraRange[];
};

export type PincodeShipQuote = {
  pincode: string | null;
  deliverable: boolean;
  scenario: "default" | "blocked" | "extra_charge";
  shipping: number;
  base_charge: number;
  extra_charge: number;
  charged_shipping: number;
  free_eligible: boolean;
  free_threshold: number;
  amount_remaining: number;
  message: string | null;
};

const DEFAULT_BLOCK_MESSAGE = "We are not supplied in this postcode.";

function pinInt(pincode: string | null | undefined): number | null {
  const raw = String(pincode ?? "").replace(/\D+/g, "");
  if (!raw) return null;
  return parseInt(raw, 10);
}

function inRange(pin: number, from: number, to: number): boolean {
  const a = from <= to ? from : to;
  const b = from <= to ? to : from;
  return pin >= a && pin <= b;
}

function rangeMessage(range: PincodeRange | undefined, fallback = DEFAULT_BLOCK_MESSAGE): string {
  const msg = String(range?.message ?? "").trim();
  return msg || fallback;
}

export function quotePincodeShipping(
  pincode: string | null | undefined,
  goodsAmount: number,
  settings: PincodeShipSettings,
): PincodeShipQuote {
  const goods = Math.max(0, Number(goodsAmount) || 0);
  const base = Number(settings.shipping_charge ?? 50) || 0;
  const globalFree = Number(settings.free_shipping_above ?? 999) || 0;
  const pinRaw = String(pincode ?? "").trim() || null;
  const pin = pinInt(pinRaw);

  const empty: PincodeShipQuote = {
    pincode: pinRaw,
    deliverable: true,
    scenario: "default",
    shipping: 0,
    base_charge: base,
    extra_charge: 0,
    charged_shipping: base,
    free_eligible: false,
    free_threshold: globalFree,
    amount_remaining: 0,
    message: null,
  };

  if (goods <= 0) return empty;

  if (pin != null) {
    for (const range of settings.non_delivery_pincodes ?? []) {
      if (inRange(pin, Number(range.from), Number(range.to))) {
        return {
          ...empty,
          deliverable: false,
          scenario: "blocked",
          charged_shipping: 0,
          message: rangeMessage(range),
        };
      }
    }

    for (const range of settings.pincode_extra_charge_ranges ?? []) {
      if (!inRange(pin, Number(range.from), Number(range.to))) continue;
      const extra = Number(range.extra_charge) || 0;
      const freeAbove = Number(range.free_above) || 0;
      const charge = Math.round(extra * 100) / 100;
      if (freeAbove > 0 && goods >= freeAbove) {
        return {
          ...empty,
          scenario: "extra_charge",
          extra_charge: extra,
          charged_shipping: charge,
          free_threshold: freeAbove,
          free_eligible: true,
          shipping: 0,
          message: "You qualify for free delivery.",
        };
      }
      const remain = freeAbove > 0 ? Math.round(Math.max(0, freeAbove - goods) * 100) / 100 : 0;
      return {
        ...empty,
        scenario: "extra_charge",
        extra_charge: extra,
        charged_shipping: charge,
        shipping: charge,
        free_threshold: freeAbove,
        amount_remaining: remain,
        message:
          freeAbove > 0
            ? `Add RM${remain.toFixed(2)} more for free delivery. Delivery charges RM${extra.toFixed(2)}.`
            : extra > 0
              ? `Delivery charges RM${extra.toFixed(2)}.`
              : null,
      };
    }
  }

  const eligible = globalFree > 0 && goods >= globalFree;
  if (eligible) {
    return {
      ...empty,
      shipping: 0,
      free_eligible: true,
      message: "You qualify for free delivery.",
    };
  }
  const remain = globalFree > 0 ? Math.round(Math.max(0, globalFree - goods) * 100) / 100 : 0;
  return {
    ...empty,
    shipping: base,
    amount_remaining: remain,
    message: globalFree > 0 ? `Add RM${remain.toFixed(2)} more for free delivery.` : null,
  };
}

export function pincodeServiceMessage(pincode: string, settings: PincodeShipSettings): string | null {
  const pin = String(pincode ?? "").replace(/\D+/g, "");
  if (pin.length < 5) return null;
  const quote = quotePincodeShipping(pin, 1, settings);
  if (!quote.deliverable) return quote.message;
  return null;
}
