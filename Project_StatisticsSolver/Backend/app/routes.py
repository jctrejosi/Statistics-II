from flask import Blueprint, jsonify, request

bp = Blueprint('main', __name__)

@bp.route('/api/v1.0/sendData', methods=['POST'])
def set_data():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No se recibieron datos"}), 400

        # Aquí podrías procesar datos, por ahora solo los devolvemos
        return jsonify({
            "mensaje": "Datos recibidos correctamente",
            "datos": data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
