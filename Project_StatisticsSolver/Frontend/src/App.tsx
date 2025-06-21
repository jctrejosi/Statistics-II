import { EditableTable } from "@components/EditableTable";
import { FileUpload, type ConverterFile } from "@components/FileUpload";
import { useState } from "react";

export const App = () => {
  const [dataTable, setDataTable] = useState<ConverterFile | undefined>(
    undefined
  );

  return (
    <>
      <FileUpload
        setData={(data) => {
          setDataTable(data);
        }}
      />
      <EditableTable
        columns={dataTable?.columns || []}
        data={dataTable?.data || []}
      />
    </>
  );
};
