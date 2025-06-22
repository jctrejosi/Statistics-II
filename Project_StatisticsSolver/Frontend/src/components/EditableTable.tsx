import { useEffect, useRef, useState } from "react";

interface EditableTableProps {
  columns: string[];
  data: (number | string | null)[][];
}

export const EditableTable = ({ columns, data }: EditableTableProps) => {
  const [tableData, setTableData] =
    useState<(number | string | null)[][]>(data);
  const [columnsNames, setColumns] = useState<string[]>([]);

  const columnName = useRef<HTMLInputElement>(null);

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string | number
  ) => {
    const updated = [...tableData];
    updated[rowIndex][colIndex] = value;
    setTableData(updated);
  };

  const addRow = () => {
    if (columnsNames.length === 0) {
      alert("Por favor, añade al menos una columna antes de añadir filas.");
      return;
    }
    setTableData([...tableData, Array(columnsNames.length).fill("")]);
  };

  const addColumn = () => {
    const newColumnName = columnName.current?.value.trim() || "";

    if (columnName.current?.value.trim() === "") {
      alert("Por favor, introduce un nombre para la columna.");
      return;
    }

    if (columnsNames.includes(newColumnName)) {
      alert("Ese nombre de columna ya existe.");
      return;
    }

    let updatedTable: (string | number | null)[][];

    if (tableData.length === 0) {
      updatedTable = [[null]];
    } else {
      updatedTable = tableData.map((row) => [...row, null]);
    }

    setTableData(updatedTable);
    setColumns([...columnsNames, newColumnName]);

    columnName.current!.value = "";
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    setColumns(columns);
  }, [columns]);

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
            {columnsNames.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
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
