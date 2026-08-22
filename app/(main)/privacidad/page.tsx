// app/(main)/privacidad/page.tsx
export default function PrivacidadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl text-ink">Política de Privacidad</h1>
      <p className="mt-2 text-sm text-stone-600">
        Última actualización: {new Date().toLocaleDateString("es")}
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-stone-600">
        <section>
          <h2 className="mb-2 font-display text-lg text-ink">1. Información que recopilamos</h2>
          <p>
            Recopilamos tu nombre, correo electrónico, y los datos de las reservas que
            realizas. Si te registras con Google, recibimos la información básica de
            perfil que autorices.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg text-ink">2. Uso de la información</h2>
          <p>
            Usamos tus datos para procesar reservas, enviarte confirmaciones por
            correo, y mejorar la plataforma. No vendemos tu información a terceros.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg text-ink">3. Pagos</h2>
          <p>
            Los pagos son procesados directamente por Stripe. No almacenamos números
            de tarjeta ni datos financieros sensibles en nuestros servidores.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg text-ink">4. Terceros</h2>
          <p>
            Utilizamos servicios de terceros para operar la plataforma: Stripe (pagos),
            Resend (correos), Cloudinary (imágenes) y proveedores de mapas para mostrar
            ubicaciones. Cada uno procesa datos según sus propias políticas.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg text-ink">5. Tus derechos</h2>
          <p>
            Puedes solicitar acceso, corrección o eliminación de tus datos personales
            contactándonos a través de los canales disponibles en la plataforma.
          </p>
        </section>
      </div>
    </div>
  );
}