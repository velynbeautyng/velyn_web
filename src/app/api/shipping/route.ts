import { NextResponse } from "next/server";
import { getShippingConfig } from "@/lib/ops/shipping";

/**
 * Public shipping config for the client checkout (so the live delivery total
 * reflects the selected state). Only fees — no secrets. Cached via ISR.
 */
export const revalidate = 300;

export async function GET() {
  const config = await getShippingConfig();
  return NextResponse.json(config);
}
