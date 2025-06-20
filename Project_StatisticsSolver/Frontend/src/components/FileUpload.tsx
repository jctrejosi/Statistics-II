import Papa from "papaparse";
import type { ChangeEvent } from "react";

interface FileUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setData: (data: any[]) => void;
}

export const FileUpload = ({ setData }: FileUploadProps) => {
  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      complete: (results: Papa.ParseResult<any>) => setData(results.data),
    });
  };

  return <input type="file" accept=".csv" onChange={handleFile} />;
};
