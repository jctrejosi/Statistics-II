/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

export const EditableTable: React.FC<EditableTableProps> = ({
  data,
  setData,
}) => {
  const handleChange = (i, key, value) => {
    const copy = [...data];
    copy[i][key] = value;
    setData(copy);
  };

  const addRow = () => {
    setData([...data, { grupo: "", valor: "" }]);
  };

  const deleteRow = (i) => {
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
