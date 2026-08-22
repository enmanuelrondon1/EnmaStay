// lib/emails/booking-confirmation-email.tsx
type BookingConfirmationEmailProps = {
  guestName: string;
  propertyTitle: string;
  city: string;
  country: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
  imageUrl?: string;
};

export function BookingConfirmationEmail({
  guestName,
  propertyTitle,
  city,
  country,
  checkIn,
  checkOut,
  totalPrice,
  imageUrl,
}: BookingConfirmationEmailProps) {
  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", backgroundColor: "#f6f3ec", padding: "32px" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "8px", overflow: "hidden", border: "1px solid #d8d3c6" }}>
        {imageUrl && (
          <img src={imageUrl} alt={propertyTitle} width="480" height="220" style={{ objectFit: "cover", display: "block" }} />
        )}
        <div style={{ padding: "24px" }}>
          <p style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: "#2f5d57", margin: "0 0 8px" }}>
            EnmaStay
          </p>
          <h1 style={{ fontSize: "22px", color: "#101b18", margin: "0 0 16px" }}>
            ¡Reserva confirmada, {guestName}!
          </h1>
          <p style={{ fontSize: "18px", color: "#101b18", margin: "0 0 4px" }}>{propertyTitle}</p>
          <p style={{ fontSize: "14px", color: "#6b6558", margin: "0 0 20px" }}>{city}, {country}</p>

          <table style={{ width: "100%", fontSize: "14px", borderTop: "1px solid #d8d3c6", paddingTop: "12px" }}>
            <tbody>
              <tr>
                <td style={{ padding: "4px 0", color: "#6b6558" }}>Entrada</td>
                <td style={{ padding: "4px 0", textAlign: "right", color: "#101b18" }}>{checkIn}</td>
              </tr>
              <tr>
                <td style={{ padding: "4px 0", color: "#6b6558" }}>Salida</td>
                <td style={{ padding: "4px 0", textAlign: "right", color: "#101b18" }}>{checkOut}</td>
              </tr>
              <tr>
                <td style={{ padding: "8px 0 0", fontWeight: 600, color: "#101b18" }}>Total pagado</td>
                <td style={{ padding: "8px 0 0", textAlign: "right", fontWeight: 600, color: "#c08a3e" }}>
                  ${totalPrice}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p style={{ textAlign: "center", fontSize: "12px", color: "#6b6558", marginTop: "16px" }}>
        Gracias por reservar con EnmaStay.
      </p>
    </div>
  );
}