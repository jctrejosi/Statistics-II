from flask import Blueprint, request, jsonify
import pyreadstat
import tempfile
import os

bp = Blueprint('main', __name__)

@bp.route('/api/v1.0/converter_sav', methods=['POST'])
def sav_file_converter():
    try:
        # Validar que el archivo fue enviado
        if 'file' not in request.files:
            return jsonify({"error": "No se recibió archivo .sav"}), 400

        file = request.files['file']

        # Guardar archivo temporalmente
        with tempfile.NamedTemporaryFile(delete=False, suffix=".sav") as temp_file:
            file.save(temp_file.name)
            temp_path = temp_file.name

        # Leer el archivo .sav
        df, meta = pyreadstat.read_sav(temp_path)

        # Convertir a JSON
        data_json = df.to_dict(orient="records")

        # Borrar archivo temporal
        os.remove(temp_path)

        return jsonify({
            "mensaje": "Archivo .sav leído correctamente",
            "filas": len(data_json),
            "columnas": list(df.columns),
            "datos": data_json
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500
