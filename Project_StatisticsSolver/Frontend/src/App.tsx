import { EditableTable } from "@components/EditableTable";
import { FileUpload } from "@components/FileUpload";
import { useState } from "react";
import { AnovaAnalysis } from "./modules/AnovaAnalysis";
import type { TableFile } from "./@types";

export const App = () => {
  const [dataTable, setDataTable] = useState<TableFile | undefined>(undefined);
  const [dataEditable, setDataEditable] = useState<TableFile | undefined>(
    undefined
  );

  return (
    <div className="App">
      <FileUpload
        setData={(data) => {
          setDataTable(data);
        }}
      />
      <EditableTable
        columns={dataTable?.columns || []}
        data={dataTable?.data || []}
        setData={(data) => setDataEditable(data)}
      />
      <AnovaAnalysis data={dataEditable} />
    </div>
  );
};
