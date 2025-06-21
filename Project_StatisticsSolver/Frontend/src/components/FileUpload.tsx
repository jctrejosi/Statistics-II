import axios from "axios";
import type { ChangeEvent } from "react";

export interface ConverterFile {
  columns: string[];
  data: (string | number | null)[][];
}
interface FileUploadProps {
  setData: (data: ConverterFile) => void;
}

export const FileUpload = ({ setData }: FileUploadProps) => {
  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("api/v1.0/converter_file", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const parsedData =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;

      setData(parsedData);
    } catch (error) {
      console.error("Error procesando archivo:", error);
      alert("Ocurrió un error al procesar el archivo.");
    }
  };

  return (
    <input type="file" accept=".csv,.sav,.xlsx,.xls" onChange={handleFile} />
  );
};
