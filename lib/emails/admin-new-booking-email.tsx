// lib/emails/admin-new-booking-email.tsx
type AdminNewBookingEmailProps = {
  guestName: string;
  guestEmail: string;
  propertyTitle: string;
  city: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
};

export function AdminNewBookingEmail({
  guestName,
  guestEmail,
  propertyTitle,
  city,
  checkIn,
  checkOut,
  totalPrice,
}: AdminNewBookingEmailProps) {
  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", backgroundColor: "#f6f3ec", padding: "32px" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "8px", padding: "24px", border: "1px solid #d8d3c6" }}>
        <p style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: "#2f5d57", margin: "0 0 8px" }}>
          EnmaStay · Nueva reserva
        </p>
        <h1 style={{ fontSize: "20px", color: "#101b18", margin: "0 0 16px" }}>
          {propertyTitle}
        </h1>

        <table style={{ width: "100%", fontSize: "14px" }}>
          <tbody>
            <tr>
              <td style={{ padding: "4px 0", color: "#6b6558" }}>Huésped</td>
              <td style={{ padding: "4px 0", textAlign: "right", color: "#101b18" }}>{guestName}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", color: "#6b6558" }}>Email</td>
              <td style={{ padding: "4px 0", textAlign: "right", color: "#101b18" }}>{guestEmail}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", color: "#6b6558" }}>Ciudad</td>
              <td style={{ padding: "4px 0", textAlign: "right", color: "#101b18" }}>{city}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", color: "#6b6558" }}>Fechas</td>
              <td style={{ padding: "4px 0", textAlign: "right", color: "#101b18" }}>{checkIn} — {checkOut}</td>
            </tr>
            <tr>
              <td style={{ padding: "8px 0 0", fontWeight: 600, color: "#101b18" }}>Total</td>
              <td style={{ padding: "8px 0 0", textAlign: "right", fontWeight: 600, color: "#c08a3e" }}>
                ${totalPrice}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}