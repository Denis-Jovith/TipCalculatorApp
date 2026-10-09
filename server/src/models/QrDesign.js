import mongoose from 'mongoose';

// Independent, reusable QR designs an admin can create for any purpose (business card,
// flyer, a specific campaign link) - separate from the single site-wide QR config in
// SiteSettings. Modelled on the "Saved QR codes" gallery pattern from the ATCL SACCOS
// admin panel. Module shape is intentionally not a field here either - see StyledQR.jsx.
const qrDesignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    value: { type: String, required: true }, // the URL/text the QR encodes
    color: { type: String, default: '#4FA8A8' },
    bgColor: { type: String, default: '#08122c' },
    logoUrl: { type: String, default: '' },
    // Kept within a scan-safe range in the UI (and re-clamped in StyledQR itself) -
    // anything much above ~0.28 of the QR's drawable area risks obscuring enough
    // modules to break a scan, especially at higher error-correction module counts.
    logoSize: { type: Number, default: 0.22, min: 0.12, max: 0.28 },
    order: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('QrDesign', qrDesignSchema);
