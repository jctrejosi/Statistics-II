// services/api.js
import axios from "axios";

type DataRow = {
  grupo: string;
  valor: number;
};

type DataResponse = {
  columnas: string[];
  datos: DataRow[];
};

type DataPayload = DataRow[];

export const sendTable = async (data: DataPayload) => {
  try {
    const res = await axios.post<DataResponse>(
      "http://localhost:5000/api/v1.0/sendData",
      {
        datos: data,
      }
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
