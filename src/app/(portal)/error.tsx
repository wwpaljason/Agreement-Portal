"use client";

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  const safe = /MongoDB|MONGODB_URI|Unknown template|not found/i.test(error.message);
  return (
    <main className="wrap">
      <h1>Something went wrong</h1>
      <p className="lede">{safe ? error.message : "Try again. If this keeps happening, check the server log."}</p>
      <button className="btn" type="button" onClick={reset}>
        Retry
      </button>
    </main>
  );
}
