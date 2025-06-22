from scipy.stats import f_oneway

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

    # Transponer la matriz para agrupar los datos por columnas
    grupos = list(zip(*data))  # Transforma filas en columnas

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
        "f_statistics": f_statistic,
        "p_value": p_value,
        "conclusion": conclusion
    }
