import numpy as np
from scipy.stats import f_oneway

def run_anova(data):
    # Transponer filas en columnas
    columnas = list(zip(*data))

    datos_limpios = []
    medias = []
    total_valores = 0

    for columna in columnas:
        limpios = []

        for valor in columna:
            if valor is None:
                continue

            try:
                num = float(valor)
                limpios.append(num)
            except (ValueError, TypeError):
                continue

        if limpios:
            datos_limpios.append(limpios)
            total_valores += len(limpios)
            media = round(sum(limpios) / len(limpios), 3)
            medias.append(media)

    media_global = np.mean([m for m in medias if m is not None])

    # Cálculo de SSB y SSE por grupo
    ssb_strings = []
    sse_strings = []
    ssb = []
    sse = []

    for i, grupo in enumerate(datos_limpios):
        ni = len(grupo)
        media_i = medias[i]

        # === SSB ===
        ssb_val = round(ni * (media_i - media_global) ** 2, 2)
        ssb.append(ssb_val)
        ssb_str = f"{ni} × ({media_i} - {round(media_global, 3)})² = {ssb_val}"
        ssb_strings.append(ssb_str)

        # === SSE ===
        sse_val = 0
        sse_terms = []

        for x in grupo:
            term = (x - media_i) ** 2
            sse_val += term
            sse_terms.append(f"({x} - {media_i})²")

        sse_str = f" + ".join(sse_terms) + f" = {round(sse_val, 2)}"
        sse.append(round(sse_val, 2))
        sse_strings.append(sse_str)

    return {
        "n_data": total_valores,
        "grupos": datos_limpios,
        "medias": medias,
        "media_global": round(media_global, 3),
        "ssb_string": ssb_strings,
        "sse_string": sse_strings,
        "sse_total": sum(sse),
        "ssb_total": sum(ssb),
        "ssb": ssb,
        "sse": sse
    }


def anova_analysis(data, columns, alpha=0.05):
    """
    Realiza un análisis ANOVA de un solo factor.

    Args:
        data (list of list): Datos numéricos organizados por filas.
        columns (list): Nombres de los grupos o métodos.
        alpha (float): Nivel de significancia, por defecto 0.05.

    Returns:
        dict: Diccionario con estadísticas ANOVA, p-valor y conclusión.
    """

    # Limpiar los datos: convertir a float y eliminar NaN y strings vacíos
    resultados = run_anova(data)

    grupos = resultados["grupos"]

    # Verificación: asegurarse de que cada grupo tiene al menos 2 datos
    if any(len(grupo) < 2 for grupo in grupos):
        return {"error": "Cada grupo debe tener al menos dos valores."}

    # Aplicar ANOVA
    f_statistic, p_value = f_oneway(*grupos)

    # Conclusión
    conclusion = (
        "Se rechaza la hipótesis nula: hay diferencias significativas entre los grupos."
        if p_value < alpha else
        "No se rechaza la hipótesis nula: no hay diferencias significativas entre los grupos."
    )

    return {
        "ok": True,
        "n_data": resultados["n_data"],
        "k_groups": len(columns),
        "f_statistics": round(f_statistic, 3),
        "means": resultados["medias"],
        "global_mean": resultados["media_global"],
        "p_value": round(p_value, 3),
        "conclusion": conclusion,
        "sse": resultados["sse"],
        "ssb": resultados["ssb"],
        "sse_string": resultados["sse_string"],
        "ssb_string": resultados["ssb_string"],
        "ssb_total": resultados["ssb_total"],
        "sse_total": resultados["sse_total"]
    }
