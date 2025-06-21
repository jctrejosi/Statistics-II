import { EditableTable } from "@components/EditableTable";
import { FileUpload } from "@components/FileUpload";

export const App = () => {
  return (
    <>
      <FileUpload setData={(data) => console.log("Data updated:", data)} />
      <EditableTable
        data={[{ grupo: "", valor: "" }]}
        setData={(data) => console.log("Data updated:", data)}
      />
    </>
  );
};
