// lib/emails/admin-new-review-email.tsx
type AdminNewReviewEmailProps = {
  guestName: string;
  propertyTitle: string;
  rating: number;
  comment: string | null;
  reviewUrl: string;
};

export function AdminNewReviewEmail({
  guestName,
  propertyTitle,
  rating,
  comment,
  reviewUrl,
}: AdminNewReviewEmailProps) {
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", padding: "24px" }}>
      <h2 style={{ color: "#1a2744" }}>Nueva reseña recibida</h2>
      <p>
        <strong>Propiedad:</strong> {propertyTitle}
      </p>
      <p>
        <strong>Huésped:</strong> {guestName}
      </p>
      <p style={{ fontSize: "20px", color: "#f59e0b", margin: "12px 0" }}>{stars}</p>
      {comment && (
        <p style={{ fontStyle: "italic", color: "#444", borderLeft: "3px solid #e5e5e5", paddingLeft: "12px" }}>
          “{comment}”
        </p>
      )}
      <div style={{ margin: "32px 0" }}>
        <a
          href={reviewUrl}
          style={{
            background: "#1a2744",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "6px",
            textDecoration: "none",
            fontWeight: "bold",
            display: "inline-block",
          }}
        >
          Ver propiedad
        </a>
      </div>
    </div>
  );
}