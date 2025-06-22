import type { TableFile } from "@/@types";
import { useState } from "react";

import { anova_analysis, type AnovaResult } from "@/services/anova_analysis";
import { AnovaResultsTable } from "./AnovaResultsTable";

type props = {
  data: TableFile | undefined;
};

export const AnovaAnalysis = ({ data }: props) => {
  const [view, setView] = useState<boolean>(false);
  const [result, setResult] = useState<AnovaResult | null>(null);

  const handleSend = async () => {
    if (!data || !data.columns || !data.data) {
      alert("No hay datos para enviar.");
      return;
    }
    try {
      const response = await anova_analysis({
        columns: data.columns,
        data: data.data,
      });
      setResult(response);
      setView(true);
    } catch (error) {
      console.error("Error al realizar el análisis ANOVA:", error);
      alert("Ocurrió un error al realizar el análisis ANOVA.");
    }
  };

  return (
    <div>
      <button onClick={handleSend}>Análisis ANOVA</button>
      {view && (
        <>
          <h1>Resultados del Análisis ANOVA</h1>
          <p>H0: Las medias de los tres métodos son iguales.</p>
          <p>H1: Al menos una media es diferente.</p>
          <p>Total de grupos: 𝑘 = {result?.k_groups}</p>
          <p>Total de datos: 𝑁 = {result?.n_data}</p>
          <AnovaResultsTable data={data} result={result} />
          <p>{result?.conclusion}</p>
          <p>Estadístico: {result?.f_statistics}</p>
          <p>Valor p: {result?.p_value}</p>
          {result?.error && <p>Error: {result.error}</p>}
        </>
      )}
    </div>
  );
};
