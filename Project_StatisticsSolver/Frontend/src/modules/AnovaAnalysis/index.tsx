import type { TableFile } from "@/@types";
import { useState } from "react";

import { anova_analysis, type AnovaResult } from "@/services/anova_analysis";

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
          <h1>Análisis ANOVA</h1>
          <p>{result?.conclusion}</p>
          <p>Estadístico: {result?.f_statistics}</p>
          <p>Valor p: {result?.p_value}</p>
          {result?.error && <p>Error: {result.error}</p>}
        </>
      )}
    </div>
  );
};
