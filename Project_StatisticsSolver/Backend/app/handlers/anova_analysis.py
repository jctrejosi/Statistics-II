from scipy.stats import f_oneway

def clean_data(data):
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

        if limpios:  # Solo agregamos si hay al menos un valor válido
            datos_limpios.append(limpios)
            total_valores += len(limpios)
            media = round(sum(limpios) / len(limpios), 3)
            medias.append(media)

    return total_valores, datos_limpios, medias


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
    n_data, grupos, medias = clean_data(data)

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
        "n_data": n_data,
        "k_groups": len(columns),
        "f_statistics": round(f_statistic, 3),
        "means": medias,
        "p_value": round(p_value, 3),
        "conclusion": conclusion
    }
