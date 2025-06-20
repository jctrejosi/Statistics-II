import os
import tempfile
import pandas as pd
import pyreadstat

def file_converter(file):
    ext = os.path.splitext(file.filename)[1].lower()

    with tempfile.NamedTemporaryFile(delete=False, suffix=ext) as temp_file:
        file.save(temp_file.name)
        temp_path = temp_file.name

    try:
        if ext == '.sav':
            df, _ = pyreadstat.read_sav(temp_path)
        elif ext == '.csv':
            df = pd.read_csv(temp_path)
        elif ext in ['.xls', '.xlsx']:
            df = pd.read_excel(temp_path, engine='openpyxl')
        else:
            raise ValueError(f"Tipo de archivo no soportado: {ext}")

        columnas = list(df.columns)

        # Convertir DataFrame a lista de listas
        data_json = df[columnas].values.tolist()

        return {
            "ok": True,
            "response": {
                "columns": columnas,
                "data": data_json
            }
        }

    except Exception as e:
        return {"ok": False, "error": str(e)}

    finally:
        os.remove(temp_path)
