// lib/emails/admin-new-lead-email.tsx
type AdminNewLeadEmailProps = {
  propertyTitle: string;
  city: string;
  name?: string;
  contact?: string;
  preferredTime?: string;
  notes?: string;
};

export function AdminNewLeadEmail({
  propertyTitle,
  city,
  name,
  contact,
  preferredTime,
  notes,
}: AdminNewLeadEmailProps) {
  return (
    <div style={{ fontFamily: "Helvetica, Arial, sans-serif", backgroundColor: "#f6f3ec", padding: "32px" }}>
      <div style={{ maxWidth: "480px", margin: "0 auto", backgroundColor: "#ffffff", borderRadius: "8px", padding: "24px", border: "1px solid #d8d3c6" }}>
        <p style={{ fontSize: "12px", letterSpacing: "1px", textTransform: "uppercase", color: "#2f5d57", margin: "0 0 8px" }}>
          EnmaStay · Interés por voz
        </p>
        <h1 style={{ fontSize: "20px", color: "#101b18", margin: "0 0 16px" }}>
          {propertyTitle}
        </h1>

        <table style={{ width: "100%", fontSize: "14px" }}>
          <tbody>
            <tr>
              <td style={{ padding: "4px 0", color: "#6b6558" }}>Ciudad</td>
              <td style={{ padding: "4px 0", textAlign: "right", color: "#101b18" }}>{city}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", color: "#6b6558" }}>Nombre</td>
              <td style={{ padding: "4px 0", textAlign: "right", color: "#101b18" }}>{name || "No proporcionado"}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", color: "#6b6558" }}>Contacto</td>
              <td style={{ padding: "4px 0", textAlign: "right", color: "#101b18" }}>{contact || "No proporcionado"}</td>
            </tr>
            <tr>
              <td style={{ padding: "4px 0", color: "#6b6558" }}>Horario preferido</td>
              <td style={{ padding: "4px 0", textAlign: "right", color: "#101b18" }}>{preferredTime || "No especificado"}</td>
            </tr>
            {notes && (
              <tr>
                <td colSpan={2} style={{ padding: "12px 0 0", color: "#6b6558" }}>
                  Notas: {notes}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}