interface EditableTableRow {
  grupo: string;
  valor: string;
}

interface EditableTableProps {
  data: EditableTableRow[];
  setData: React.Dispatch<React.SetStateAction<EditableTableRow[]>>;
}

export const EditableTable: React.FC<EditableTableProps> = ({
  data,
  setData,
}) => {
  const handleChange = (
    i: number,
    key: keyof EditableTableRow,
    value: string
  ) => {
    const copy = [...data];
    copy[i][key] = value;
    setData(copy);
  };

  const addRow = () => {
    setData([...data, { grupo: "", valor: "" }]);
  };

  const deleteRow = (i: number) => {
    setData(data.filter((_, index) => index !== i));
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Grupo</th>
            <th>Valor</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              <td>
                <input
                  value={row.grupo}
                  onChange={(e) => handleChange(i, "grupo", e.target.value)}
                />
              </td>
              <td>
                <input
                  value={row.valor}
                  onChange={(e) => handleChange(i, "valor", e.target.value)}
                />
              </td>
              <td>
                <button onClick={() => deleteRow(i)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={addRow}>Agregar fila</button>
    </div>
  );
};
