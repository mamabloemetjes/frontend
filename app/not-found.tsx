import Link from "next/link";
import "@/globals.css";

export default function GlobalNotFound() {
  return (
    <html lang="nl">
      <body className="min-h-screen bg-background text-foreground">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center px-4">
            <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-bold mb-4">Pagina niet gevonden</h2>
            <p className="text-lg text-muted-foreground mb-8">
              De pagina die u zoekt bestaat niet of is verplaatst.
            </p>
            <Link
              href="/nl"
              className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-semibold"
            >
              Terug naar home
            </Link>
            <div className="mt-12">
              <div className="text-9xl opacity-20" aria-hidden="true">
                🌸
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
