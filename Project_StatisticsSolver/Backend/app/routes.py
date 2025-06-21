from flask import Blueprint, request, jsonify
from .handlers.file_converter import file_converter

bp = Blueprint('main', __name__)

@bp.route('/api/v1.0/converter_file', methods=['POST'])
def converter_file():
    if 'file' not in request.files:
        return jsonify({"error": "No se recibió ningún archivo"}), 400

    file = request.files['file']
    resultado = file_converter(file)

    if resultado["ok"]:
        return jsonify(resultado["respuesta"]), 200
    else:
        return jsonify({"error": resultado["error"]}), 500
