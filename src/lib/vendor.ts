import type { Vendor } from "@/types/s3"

export function getVendorById(vendors: Vendor[], id: string): Vendor | undefined {
  return vendors.find(vendor => vendor.id === id)
}