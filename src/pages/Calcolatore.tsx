import { useState } from "react";
import { OperazioniTool } from "./calc/OperazioniTool";
import { DeterminanteTool } from "./calc/DeterminanteTool";
import { InversaTool } from "./calc/InversaTool";
import { SistemaTool } from "./calc/SistemaTool";
import { AutovaloriTool } from "./calc/AutovaloriTool";
import { CambioBaseTool } from "./calc/CambioBaseTool";
import { ProiezioniTool } from "./calc/ProiezioniTool";

type Tab = "operazioni" | "determinante" | "inversa" | "sistema" | "autovalori" | "cambiobase" | "proiezioni";

const tabs: { id: Tab; label: string }[] = [
  { id: "operazioni", label: "Operazioni tra matrici" },
  { id: "determinante", label: "Determinante" },
  { id: "inversa", label: "Matrice inversa" },
  { id: "sistema", label: "Sistemi lineari" },
  { id: "autovalori", label: "Autovalori e autovettori" },
  { id: "cambiobase", label: "Cambio di base" },
  { id: "proiezioni", label: "Proiezioni e distanze" },
];

export function Calcolatore() {
  const [tab, setTab] = useState<Tab>("determinante");

  return (
    <div>
      <span className="pill">Pratica</span>
      <h1>Calcolatore con passaggi</h1>
      <p style={{ color: "var(--text-muted)" }}>
        Inserisci i valori (numeri interi, decimali o frazioni come <code>3/4</code>) e ottieni il
        risultato con lo svolgimento passo-passo.
      </p>

      <div className="tab-row">
        {tabs.map((t) => (
          <button key={t.id} className={`tab-btn ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === "operazioni" && <OperazioniTool />}
        {tab === "determinante" && <DeterminanteTool />}
        {tab === "inversa" && <InversaTool />}
        {tab === "sistema" && <SistemaTool />}
        {tab === "autovalori" && <AutovaloriTool />}
        {tab === "cambiobase" && <CambioBaseTool />}
        {tab === "proiezioni" && <ProiezioniTool />}
      </div>
    </div>
  );
}
