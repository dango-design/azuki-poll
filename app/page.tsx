export default function Home() {
  return (
    <div className="poll-page">
      <div className="poll-header">
        <div className="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src="/azuki-baby-logo.png" alt="Azuki Baby" />
          <span>Azuki Baby</span>
        </div>
      </div>
      <div className="intro">
        <h1 className="question">This poll is invite-only.</h1>
        <p className="subtitle">
          Please open the link from your email to cast your vote.
        </p>
      </div>
    </div>
  );
}
