import { Link } from "react-router-dom";
import { topicSummaries } from "../nav";

export function Home() {
  return (
    <div>
      <span className="pill">Algebra Lineare</span>
      <h1>Studia l'algebra lineare, un passaggio alla volta</h1>
      <p style={{ color: "var(--text-muted)", maxWidth: 640 }}>
        Teoria, calcolatore con passaggi svolti, visualizzazioni interattive e quiz per
        ripassare vettori, spazi vettoriali, matrici, sistemi lineari, determinanti e
        autovalori/autovettori.
      </p>

      <div className="btn-row">
        <Link to="/calcolatore" className="btn">
          Vai al calcolatore
        </Link>
        <Link to="/quiz" className="btn secondary">
          Metti alla prova con un quiz
        </Link>
      </div>

      <h2 style={{ marginTop: "2rem" }}>Argomenti</h2>
      <div className="topic-grid">
        {topicSummaries.map((t) => (
          <Link key={t.to} to={t.to} className="topic-card">
            <h3>{t.title}</h3>
            <p>{t.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
