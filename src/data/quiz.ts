export interface Question {
  id: string;
  topic: string;
  prompt: string;
  tex?: string;
  options: string[];
  correct: number;
  explanation: string;
}

export const questions: Question[] = [
  // Vettori
  {
    id: "v1",
    topic: "Vettori",
    prompt: "Dati u = (1, 2) e v = (3, -1), quanto vale u + v?",
    options: ["(4, 1)", "(4, -3)", "(2, 3)", "(-2, 3)"],
    correct: 0,
    explanation: "Si sommano le componenti corrispondenti: (1+3, 2-1) = (4, 1).",
  },
  {
    id: "v2",
    topic: "Vettori",
    prompt: "Il prodotto scalare u · v tra due vettori non nulli è zero. Cosa significa?",
    options: [
      "u e v sono paralleli",
      "u e v sono ortogonali",
      "u e v sono uguali",
      "u e v hanno lo stesso modulo",
    ],
    correct: 1,
    explanation: "u·v = |u||v|cosθ; se il prodotto è nullo e i vettori non sono nulli, cosθ = 0, cioè θ = 90°.",
  },
  {
    id: "v3",
    topic: "Vettori",
    prompt: "Il prodotto vettoriale u × v è definito...",
    options: [
      "in ℝ² e ℝ³",
      "solo in ℝ³",
      "solo in ℝ²",
      "in qualsiasi ℝⁿ",
    ],
    correct: 1,
    explanation: "Il prodotto vettoriale (cross product) classico è definito solo per vettori in ℝ³.",
  },
  {
    id: "v4",
    topic: "Vettori",
    prompt: "Il modulo del prodotto vettoriale |u × v| rappresenta...",
    options: [
      "la somma dei moduli",
      "l'area del parallelogramma generato da u e v",
      "il coseno dell'angolo tra u e v",
      "il volume del parallelepipedo",
    ],
    correct: 1,
    explanation: "|u × v| = |u||v|sinθ, che è esattamente l'area del parallelogramma generato dai due vettori.",
  },

  // Spazi vettoriali
  {
    id: "s1",
    topic: "Spazi vettoriali",
    prompt: "Quale delle seguenti è una condizione necessaria per essere un sottospazio vettoriale?",
    options: [
      "Contenere il vettore nullo",
      "Contenere almeno due vettori indipendenti",
      "Avere dimensione dispari",
      "Non contenere l'origine",
    ],
    correct: 0,
    explanation: "Ogni sottospazio vettoriale deve contenere il vettore nullo (è chiuso rispetto alla combinazione lineare con coefficienti nulli).",
  },
  {
    id: "s2",
    topic: "Spazi vettoriali",
    prompt: "Qual è la dimensione di ℝ⁴?",
    options: ["2", "3", "4", "16"],
    correct: 2,
    explanation: "La base canonica di ℝ⁴ ha 4 vettori (e1,...,e4), quindi dim ℝ⁴ = 4.",
  },
  {
    id: "s3",
    topic: "Spazi vettoriali",
    prompt: "Tre vettori in ℝ² possono essere linearmente indipendenti?",
    options: ["Sì, sempre", "No, mai", "Solo se sono ortogonali", "Solo se hanno modulo 1"],
    correct: 1,
    explanation: "In uno spazio di dimensione 2, al più 2 vettori possono essere indipendenti: un terzo è sempre combinazione lineare dei primi due.",
  },
  {
    id: "s4",
    topic: "Spazi vettoriali",
    prompt: "Una base di uno spazio vettoriale V è un insieme di vettori che...",
    options: [
      "generano V ma possono essere dipendenti",
      "sono indipendenti ma non generano V",
      "sono indipendenti e generano V",
      "contengono solo il vettore nullo",
    ],
    correct: 2,
    explanation: "Per definizione una base deve essere sia un insieme di generatori sia linearmente indipendente.",
  },

  // Matrici
  {
    id: "m1",
    topic: "Matrici",
    prompt: "Se A è 2×3 e B è 3×4, che dimensioni ha AB?",
    options: ["2×4", "3×3", "4×2", "Il prodotto non è definito"],
    correct: 0,
    explanation: "Il prodotto AB è definito perché le colonne di A (3) coincidono con le righe di B (3); il risultato ha le righe di A e le colonne di B: 2×4.",
  },
  {
    id: "m2",
    topic: "Matrici",
    prompt: "Il prodotto tra matrici è in generale...",
    options: ["commutativo", "non commutativo", "sempre invertibile", "sempre simmetrico"],
    correct: 1,
    explanation: "In generale AB ≠ BA, anche quando entrambi i prodotti sono definiti.",
  },
  {
    id: "m3",
    topic: "Matrici",
    prompt: "Una matrice quadrata A è invertibile se e solo se...",
    options: ["det A = 0", "det A ≠ 0", "A è simmetrica", "A ha tutti gli elementi positivi"],
    correct: 1,
    explanation: "A è invertibile esattamente quando il suo determinante è diverso da zero.",
  },
  {
    id: "m4",
    topic: "Matrici",
    prompt: "La trasposta di una matrice A si ottiene...",
    options: [
      "invertendo il segno di ogni elemento",
      "scambiando righe con colonne",
      "moltiplicando per -1",
      "calcolando l'inversa",
    ],
    correct: 1,
    explanation: "(Aᵀ)ᵢⱼ = Aⱼᵢ: la trasposizione scambia righe e colonne.",
  },

  // Sistemi lineari
  {
    id: "l1",
    topic: "Sistemi lineari",
    prompt: "Per il teorema di Rouché-Capelli, un sistema Ax = b ha soluzione se e solo se...",
    options: [
      "det A = 0",
      "rg(A) = rg([A|b])",
      "il sistema è quadrato",
      "b è il vettore nullo",
    ],
    correct: 1,
    explanation: "Il sistema è compatibile (ha almeno una soluzione) se e solo se il rango della matrice dei coefficienti coincide con quello della matrice completa.",
  },
  {
    id: "l2",
    topic: "Sistemi lineari",
    prompt: "Se rg(A) = rg([A|b]) = 2 e ci sono 4 incognite, quante soluzioni ha il sistema?",
    options: ["Nessuna", "Una sola", "∞²", "∞⁴"],
    correct: 2,
    explanation: "Il numero di parametri liberi è n - rg(A) = 4 - 2 = 2, quindi ∞² soluzioni.",
  },
  {
    id: "l3",
    topic: "Sistemi lineari",
    prompt: "La regola di Cramer per risolvere Ax = b richiede che...",
    options: [
      "A sia quadrata e det A ≠ 0",
      "A sia simmetrica",
      "b sia il vettore nullo",
      "A abbia più righe che colonne",
    ],
    correct: 0,
    explanation: "Cramer si applica solo a sistemi quadrati con matrice dei coefficienti invertibile (det A ≠ 0).",
  },
  {
    id: "l4",
    topic: "Sistemi lineari",
    prompt: "Un sistema omogeneo Ax = 0 ammette sempre...",
    options: [
      "la sola soluzione nulla",
      "almeno la soluzione nulla",
      "nessuna soluzione",
      "infinite soluzioni",
    ],
    correct: 1,
    explanation: "x = 0 è sempre soluzione di un sistema omogeneo; ce ne sono altre solo se rg(A) < n.",
  },

  // Determinanti
  {
    id: "d1",
    topic: "Determinanti",
    prompt: "Il determinante della matrice [[2,1],[3,4]] vale...",
    options: ["5", "8", "-5", "11"],
    correct: 0,
    explanation: "det = 2·4 - 1·3 = 8 - 3 = 5.",
  },
  {
    id: "d2",
    topic: "Determinanti",
    prompt: "Se una matrice ha una riga di soli zeri, il suo determinante...",
    options: ["è sempre 1", "è sempre 0", "dipende dalle altre righe", "non è definito"],
    correct: 1,
    explanation: "Sviluppando lungo quella riga, tutti i termini si annullano: il determinante è 0.",
  },
  {
    id: "d3",
    topic: "Determinanti",
    prompt: "Scambiando due righe di una matrice, il determinante...",
    options: ["resta invariato", "cambia segno", "diventa zero", "raddoppia"],
    correct: 1,
    explanation: "Lo scambio di due righe (o colonne) inverte il segno del determinante.",
  },
  {
    id: "d4",
    topic: "Determinanti",
    prompt: "Vale sempre det(AB) = ?",
    options: ["det(A) + det(B)", "det(A) · det(B)", "det(A) - det(B)", "det(A)/det(B)"],
    correct: 1,
    explanation: "Il determinante del prodotto è il prodotto dei determinanti: det(AB) = det(A)·det(B).",
  },

  // Autovalori
  {
    id: "a1",
    topic: "Autovalori e autovettori",
    prompt: "Gli autovalori di una matrice A sono le radici di...",
    options: [
      "det(A) = 0",
      "det(A - λI) = 0",
      "tr(A) = 0",
      "A·Aᵀ = I",
    ],
    correct: 1,
    explanation: "Gli autovalori risolvono il polinomio caratteristico det(A - λI) = 0.",
  },
  {
    id: "a2",
    topic: "Autovalori e autovettori",
    prompt: "Per la matrice [[3,0],[0,5]] (diagonale), quali sono gli autovalori?",
    options: ["3 e 5", "8 e 0", "15 e 0", "3 e 3"],
    correct: 0,
    explanation: "Per una matrice diagonale, gli autovalori sono esattamente gli elementi sulla diagonale: 3 e 5.",
  },
  {
    id: "a3",
    topic: "Autovalori e autovettori",
    prompt: "Un autovettore associato a un autovalore λ soddisfa...",
    options: ["Av = v", "Av = λv", "Av = 0", "A = λI"],
    correct: 1,
    explanation: "Per definizione, v è autovettore di A con autovalore λ se Av = λv (e v ≠ 0).",
  },
  {
    id: "a4",
    topic: "Autovalori e autovettori",
    prompt: "Una matrice è diagonalizzabile se...",
    options: [
      "ha determinante nullo",
      "esiste una base di autovettori",
      "è antisimmetrica",
      "ha tutti gli autovalori nulli",
    ],
    correct: 1,
    explanation: "A è diagonalizzabile (A = PDP⁻¹) se e solo se esiste una base dello spazio formata da autovettori di A.",
  },
];
