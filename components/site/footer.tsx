// components/site/footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-300 bg-ink text-canvas-soft">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <span className="font-display text-lg italic">EnmaStay</span>
            <p className="mt-2 text-sm text-canvas-soft/70">
              Encuentra tu próxima estadía, en el lugar exacto.
            </p>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-canvas-soft/50">
              Explorar
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/buscar" className="text-canvas-soft/80 hover:text-brass">
                  Todas las propiedades
                </Link>
              </li>
              <li>
                <Link href="/favoritos" className="text-canvas-soft/80 hover:text-brass">
                  Favoritos
                </Link>
              </li>
              <li>
                <Link href="/mi-cuenta" className="text-canvas-soft/80 hover:text-brass">
                  Mis reservas
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-mono text-xs uppercase tracking-widest text-canvas-soft/50">
              Cuenta
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-canvas-soft/80 hover:text-brass">
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link href="/registro" className="text-canvas-soft/80 hover:text-brass">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>
        </div>

     <div className="mt-10 flex flex-col gap-3 border-t border-canvas-soft/10 pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
  <span className="font-mono text-canvas-soft/50">
    © {new Date().getFullYear()} EnmaStay. Todos los derechos reservados.
  </span>
  <div className="flex gap-4">
    <Link href="/terminos" className="text-canvas-soft/60 hover:text-brass">
      Términos
    </Link>
    <Link href="/privacidad" className="text-canvas-soft/60 hover:text-brass">
      Privacidad
    </Link>
  </div>
</div>
      </div>
    </footer>
  );
}