import { signIn } from "@/auth";
import { readWhitelist } from "@/lib/whitelist";

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const denied = params.error === "AccessDenied";
  const googleReady = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);
  const whitelist = readWhitelist();

  return (
    <main className="login-shell">
      <section className="login-card">
        <img src="/logo.jpg" alt="Win Win Property Agency Limited" className="logo" />
        <div className="en">Agreement portal</div>
        {denied && (
          <p className="banner">
            That Google account is not allowed. Add the address to <code>config/allowed-emails.txt</code> and try again.
          </p>
        )}
        {!googleReady && (
          <p className="banner">
            Add <code>AUTH_GOOGLE_ID</code> and <code>AUTH_GOOGLE_SECRET</code> to <code>.env.local</code>, then restart.
            Redirect URI: <code>http://localhost:3000/api/auth/callback/google</code>
          </p>
        )}
        {whitelist.length === 0 && (
          <p className="banner">
            The whitelist is empty. Put one Google email per line in <code>config/allowed-emails.txt</code>.
          </p>
        )}
        {googleReady && (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/" });
            }}
          >
            <button className="btn primary" type="submit">
              Continue with Google
            </button>
          </form>
        )}
      </section>
    </main>
  );
}
