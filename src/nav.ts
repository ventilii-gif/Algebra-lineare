export interface NavItem {
  to: string;
  label: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    title: "Teoria",
    items: [
      { to: "/teoria/vettori", label: "Vettori" },
      { to: "/teoria/spazi-vettoriali", label: "Spazi vettoriali" },
      { to: "/teoria/matrici", label: "Matrici" },
      { to: "/teoria/trasformazioni-lineari", label: "Trasformazioni lineari" },
      { to: "/teoria/sistemi-lineari", label: "Sistemi lineari" },
      { to: "/teoria/determinanti", label: "Determinanti" },
      { to: "/teoria/autovalori", label: "Autovalori e autovettori" },
      { to: "/teoria/cambio-base", label: "Cambiamenti di base" },
      { to: "/teoria/proiezioni-distanze", label: "Proiezioni e distanze" },
    ],
  },
  {
    title: "Pratica",
    items: [
      { to: "/calcolatore", label: "Calcolatore" },
      { to: "/visualizzazioni", label: "Visualizzazioni" },
      { to: "/quiz", label: "Quiz" },
    ],
  },
];

export const topicSummaries = [
  {
    to: "/teoria/vettori",
    title: "Vettori",
    desc: "Spazi affini, direzioni, vettori geometrici, operazioni",
  },
  {
    to: "/teoria/spazi-vettoriali",
    title: "Spazi vettoriali",
    desc: "Assiomi, combinazioni lineari, basi e dimensione",
  },
  {
    to: "/teoria/matrici",
    title: "Matrici",
    desc: "Operazioni, prodotto righe per colonne, inversa, trasposta",
  },
  {
    to: "/teoria/trasformazioni-lineari",
    title: "Trasformazioni lineari",
    desc: "Matrice associata, nucleo e immagine, teorema del rango, composizione",
  },
  {
    to: "/teoria/sistemi-lineari",
    title: "Sistemi lineari",
    desc: "Gauss, Cramer, Rouché-Capelli, soluzioni parametriche",
  },
  {
    to: "/teoria/determinanti",
    title: "Determinanti",
    desc: "Regola di Sarrus, Laplace, area e volume con segno",
  },
  {
    to: "/teoria/autovalori",
    title: "Autovalori e autovettori",
    desc: "Polinomio caratteristico, diagonalizzazione",
  },
  {
    to: "/teoria/cambio-base",
    title: "Cambiamenti di base",
    desc: "Cambio di riferimento in 1, 2, 3 dimensioni: P' = B⁻¹(P − O')",
  },
  {
    to: "/teoria/proiezioni-distanze",
    title: "Proiezioni e distanze",
    desc: "Punto–retta in R² e punto–piano in R³, con metodo delle equazioni e vettoriale",
  },
];
