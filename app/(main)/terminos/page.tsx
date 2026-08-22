// app/(main)/terminos/page.tsx
export default function TerminosPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-display text-3xl text-ink">Términos y Condiciones</h1>
      <p className="mt-2 text-sm text-stone-600">
        Última actualización: {new Date().toLocaleDateString("es")}
      </p>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-stone-600">
        <section>
          <h2 className="mb-2 font-display text-lg text-ink">1. Aceptación de los términos</h2>
          <p>
            Al usar EnmaStay, aceptas estos términos en su totalidad. Si no estás de
            acuerdo con alguna parte, te pedimos no utilizar la plataforma.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg text-ink">2. Reservas y pagos</h2>
          <p>
            Todas las reservas se confirman únicamente tras un pago exitoso procesado
            por Stripe. El precio mostrado por noche es final e incluye todos los cargos
            aplicables, salvo que se indique lo contrario.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg text-ink">3. Cancelaciones</h2>
          <p>
            Puedes cancelar una reserva antes de la fecha de entrada desde tu cuenta.
            Las reservas pagadas y canceladas antes del check-in son reembolsadas
            automáticamente al método de pago original.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg text-ink">4. Responsabilidades del huésped</h2>
          <p>
            El huésped se compromete a hacer un uso adecuado de la propiedad reservada
            y a respetar las normas de convivencia y las condiciones acordadas al
            momento de la reserva.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg text-ink">5. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos términos en cualquier momento.
            Los cambios serán efectivos desde su publicación en esta página.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-display text-lg text-ink">6. Contacto</h2>
          <p>
            Para preguntas sobre estos términos, contáctanos a través de los canales
            disponibles en la plataforma.
          </p>
        </section>
      </div>
    </div>
  );
}