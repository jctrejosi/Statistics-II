import { useEffect, useState } from "react";

interface EditableTableProps {
  columns: string[];
  data: (string | number | null)[][];
}

export const EditableTable = ({ columns, data }: EditableTableProps) => {
  const [tableData, setTableData] =
    useState<(string | number | null)[][]>(data);

  const handleCellChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const updated = [...tableData];
    updated[rowIndex][colIndex] = value;
    setTableData(updated);
  };

  const addRow = () => {
    setTableData([...tableData, Array(columns.length).fill("")]);
  };

  const addColumn = () => {
    const updated = tableData.map((row) => [...row, ""]);
    setTableData(updated);
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  return (
    <div>
      <button onClick={addRow}>➕ Añadir fila</button>
      <button onClick={addColumn}>➕ Añadir columna</button>

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
          {tableData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <input
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
