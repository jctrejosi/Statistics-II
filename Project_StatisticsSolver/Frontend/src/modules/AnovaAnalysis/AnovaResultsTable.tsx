import type { TableFile } from "@/@types";
import type { AnovaResult } from "@/services/anova_analysis";

type Props = {
  result: AnovaResult | null;
  data: TableFile | undefined;
};

export const AnovaResultsTable = ({ result, data }: Props) => {
  if (!result || !data) {
    return <p>No hay resultados para mostrar.</p>;
  }

  // Transponer data.data (filas → columnas)
  const numColumns = data.columns.length;
  const columnas: (string | number | null)[][] = Array.from(
    { length: numColumns },
    () => []
  );

  data.data.forEach((fila) => {
    fila.forEach((valor, colIndex) => {
      columnas[colIndex].push(valor);
    });
  });

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Grupo</th>
            <th>Datos del grupo</th>
            <th>Media</th>
          </tr>
        </thead>
        <tbody>
          {columnas.map((colData, colIndex) => {
            const grupo = data.columns[colIndex];
            const valores = colData.filter((v) => v !== null && v !== "") as (
              | string
              | number
            )[];
            const valoresStr = valores.map((v) => v.toString()).join(", ");
            const media = result.means[colIndex];

            return (
              <tr key={colIndex}>
                <td>{grupo}</td>
                <td>{valoresStr}</td>
                <td>{media !== undefined ? media.toFixed(2) : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
