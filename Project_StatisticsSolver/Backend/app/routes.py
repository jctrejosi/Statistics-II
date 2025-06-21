from flask import Blueprint, request, jsonify
from .handlers.file_converter import file_converter

bp = Blueprint('main', __name__)

@bp.route('/api/v1.0/converter_file', methods=['POST'])
def converter_file():
    if 'file' not in request.files:
        return jsonify({"error": "No se recibió ningún archivo"}), 400

    file = request.files['file']

    try:
        resultado = file_converter(file)
        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
