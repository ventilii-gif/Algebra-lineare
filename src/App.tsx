import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./pages/Home";
import { Vettori } from "./pages/theory/Vettori";
import { SpaziVettoriali } from "./pages/theory/SpaziVettoriali";
import { Matrici } from "./pages/theory/Matrici";
import { SistemiLineari } from "./pages/theory/SistemiLineari";
import { Determinanti } from "./pages/theory/Determinanti";
import { Autovalori } from "./pages/theory/Autovalori";
import { Calcolatore } from "./pages/Calcolatore";
import { Visualizzazioni } from "./pages/Visualizzazioni";
import { Quiz } from "./pages/Quiz";

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/teoria/vettori" element={<Vettori />} />
          <Route path="/teoria/spazi-vettoriali" element={<SpaziVettoriali />} />
          <Route path="/teoria/matrici" element={<Matrici />} />
          <Route path="/teoria/sistemi-lineari" element={<SistemiLineari />} />
          <Route path="/teoria/determinanti" element={<Determinanti />} />
          <Route path="/teoria/autovalori" element={<Autovalori />} />
          <Route path="/calcolatore" element={<Calcolatore />} />
          <Route path="/visualizzazioni" element={<Visualizzazioni />} />
          <Route path="/quiz" element={<Quiz />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
