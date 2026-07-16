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
      { to: "/teoria/sistemi-lineari", label: "Sistemi lineari" },
      { to: "/teoria/determinanti", label: "Determinanti" },
      { to: "/teoria/autovalori", label: "Autovalori e autovettori" },
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
];
