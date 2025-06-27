import type { TableFile } from "@/@types";
import { useEffect, useRef } from "react";

interface EditableTableProps {
  columns: string[];
  data: (number | string | null)[][];
  setData: (data: TableFile) => void;
}

export const EditableTable = ({
  columns,
  data,
  setData,
}: EditableTableProps) => {
  const columnName = useRef<HTMLInputElement>(null);

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string | number
  ) => {
    const updated = [...data];
    updated[rowIndex][colIndex] = value;
    setData({ columns, data: updated })
  };

  const addRow = () => {
    if (columns.length === 0) {
      alert("Por favor, añade al menos una columna antes de añadir filas.");
      return;
    }
  };

  const addColumn = () => {
    const newColumnName = columnName.current?.value.trim() || "";

    if (columnName.current?.value.trim() === "") {
      alert("Por favor, introduce un nombre para la columna.");
      return;
    }

    if (columns.includes(newColumnName)) {
      alert("Ese nombre de columna ya existe.");
      return;
    }

    let updatedTable: (string | number | null)[][];

    if (data.length === 0) {
      updatedTable = [[null]];
    } else {
      updatedTable = data.map((row) => [...row, null]);
    }

    columnName.current!.value = "";
  };

  useEffect(() => {
    setData({ columns, data });
  }, [columns, data, setData]);

  return (
    <div>
      <button onClick={addRow}>+ Añadir fila</button>
      <div>
        <button onClick={addColumn}>+ Añadir columna</button>
        <label htmlFor="column">Nombre de la columna:</label>
        <input
          id="column"
          type="text"
          placeholder="Nombre de la columna"
          ref={columnName}
          style={{ marginLeft: "0.5rem" }}
        />
      </div>

      <table
        border={1}
        style={{ borderCollapse: "collapse", marginTop: "1rem" }}
      >
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
                    type="text"
                    value={cell ?? ""}
                    onChange={(e) =>
                      handleCellChange(rowIndex, colIndex, e.target.value)
                    }
                    style={{ width: "100px" }}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
