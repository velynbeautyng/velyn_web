"use client";

import { useEffect, useState } from "react";
import { DEFAULT_SHIPPING_CONFIG, type ShippingConfig } from "@/lib/shipping";

/** The live ops shipping config, starting from the defaults until it loads. */
export function useShippingConfig(): ShippingConfig {
  const [config, setConfig] = useState<ShippingConfig>(DEFAULT_SHIPPING_CONFIG);

  useEffect(() => {
    let alive = true;
    fetch("/api/shipping")
      .then((r) => (r.ok ? r.json() : null))
      .then((c) => {
        if (alive && c) setConfig(c as ShippingConfig);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  return config;
}
