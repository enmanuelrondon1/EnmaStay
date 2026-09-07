// components/site/value-props.tsx
type ValueProp = {
  title: string;
  description: string;
  icon: string;
};

const props: ValueProp[] = [
  {
    icon: "🤝",
    title: "Reserva directa",
    description: "Sin intermediarios ni comisiones ocultas entre tú y el anfitrión.",
  },
  {
    icon: "🔒",
    title: "Pago seguro",
    description: "Transacciones protegidas mediante Stripe, con confirmación instantánea.",
  },
  {
    icon: "📍",
    title: "Ubicación real",
    description: "Cada propiedad está verificada con su ubicación exacta en el mapa.",
  },
  {
    icon: "↩️",
    title: "Cancelación flexible",
    description: "Cambia o cancela tu reserva fácilmente desde tu cuenta.",
  },
];

export function ValueProps() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {props.map((p) => (
          <div key={p.title} className="text-center sm:text-left">
            <span className="text-3xl">{p.icon}</span>
            <h3 className="mt-3 font-display text-lg text-ink">{p.title}</h3>
            <p className="mt-1 text-sm text-stone-600">{p.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}