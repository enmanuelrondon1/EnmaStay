// lib/emails/review-thank-you-email.tsx
type ReviewThankYouEmailProps = {
  guestName: string;
  propertyTitle: string;
  rating: number;
};

export function ReviewThankYouEmail({
  guestName,
  propertyTitle,
  rating,
}: ReviewThankYouEmailProps) {
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: "600px", margin: "0 auto", padding: "24px" }}>
      <h2 style={{ color: "#1a2744" }}>¡Gracias por tu reseña, {guestName}! 🙌</h2>
      <p>
        Tu opinión sobre <strong>{propertyTitle}</strong> ya fue publicada y ayuda a
        otros huéspedes a encontrar su próxima estadía.
      </p>
      <p style={{ fontSize: "20px", color: "#f59e0b", margin: "16px 0" }}>{stars}</p>
      <p style={{ color: "#666", fontSize: "14px" }}>
        Esperamos verte pronto de nuevo en EnmaStay.
      </p>
    </div>
  );
}