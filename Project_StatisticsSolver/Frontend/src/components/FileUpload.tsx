import Papa from "papaparse";
import axios from "axios";
import type { ChangeEvent } from "react";

interface FileUploadProps {
  setData: (data: unknown[]) => void;
}

export const FileUpload = ({ setData }: FileUploadProps) => {
  const handleFile = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const extension = file.name.split(".").pop()?.toLowerCase();

    if (extension === "sav") {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("api/v1.0/converter_sav", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const datos = response.data;

        if (datos) {
          setData(datos);
        } else {
          alert("El backend no devolvió datos válidos.");
        }
      } catch (error) {
        console.error("Error en el envío del .sav:", error);
        alert("Error procesando archivo .sav");
      }
    } else if (extension === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header: string) => header.trim().toLowerCase(),
        transform: (value: string) => value.trim(),
        error: (error) => {
          console.error("Error parsing CSV:", error);
          alert("Error al procesar archivo CSV.");
        },
        complete: (results) => setData(results.data),
      });
    } else {
      alert("Formato de archivo no soportado. Solo .csv o .sav");
    }
  };

  return <input type="file" accept=".csv,.sav" onChange={handleFile} />;
};
