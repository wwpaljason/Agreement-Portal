import { auth, signOut } from "@/auth";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <>
      <header className="topbar no-print">
        <a className="brand" href="/">
          約
        </a>
        <nav>
          <a href="/">Agreements</a>
          <a href="/templates">Templates</a>
        </nav>
        <span className="who">{session?.user?.email}</span>
        <form
          style={{ marginLeft: "auto" }}
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <button className="btn" type="submit">
            Sign out
          </button>
        </form>
      </header>
      {children}
    </>
  );
}
