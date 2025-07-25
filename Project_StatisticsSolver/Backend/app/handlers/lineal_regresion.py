from flask import Blueprint, request, jsonify
import pandas as pd
import numpy as np
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor
from statsmodels.stats.diagnostic import het_breuschpagan
from statsmodels.stats.stattools import durbin_watson
from scipy.stats import shapiro, kstest

bp = Blueprint('bp', __name__)

def run_regression(data: list, columns: list, dependent: str, alpha: float = 0.05) -> dict:
    """
    data: lista de filas (cada fila: lista de valores numéricos u None)
    columns: nombres de todas las columnas, p.ej. ['X1','X2','Y']
    dependent: nombre de la variable respuesta, p.ej. 'Y'
    """
    # 2. DataFrame y limpieza básica
    df = pd.DataFrame(data, columns=columns).apply(pd.to_numeric, errors='coerce')
    df = df.dropna()  # eliminar filas con NaN

    if dependent not in df.columns:
        return {"ok": False, "error": f"Variable dependiente '{dependent}' no encontrada."}

    # 3. Definir X e y
    y = df[dependent]
    X = df.drop(columns=[dependent])
    X_const = sm.add_constant(X)

    # 4. Ajustar modelo
    model = sm.OLS(y, X_const).fit()

    # 5. Estadísticos principales
    r2        = model.rsquared
    r2_adj    = model.rsquared_adj
    f_stat    = model.fvalue
    f_pvalue  = model.f_pvalue

    # 6. ANOVA del modelo
    anova_tbl = sm.stats.anova_lm(model, typ=2)
    anova = {}
    for idx, row in anova_tbl.iterrows():
        anova[idx] = {
            "df":      float(row["df"]),
            "sum_sq":  float(row["sum_sq"]),
            "mean_sq": float(row["mean_sq"]),
            "F":       float(row.get("F", np.nan)),
            "PR(>F)":  float(row.get("PR(>F)", np.nan))
        }

    # 7. Pruebas de supuestos
    resid  = model.resid
    fitted = model.fittedvalues

    # 7.1 Normalidad de residuos
    sw_stat, sw_p    = shapiro(resid)
    ks_stat, ks_p    = kstest((resid - resid.mean())/resid.std(ddof=1), 'norm')

    # 7.2 Homoscedasticidad: Breusch–Pagan
    bp_test = het_breuschpagan(resid, X_const)
    bp = {"Lagrange multiplier": float(bp_test[0]),
          "p-value":             float(bp_test[1]),
          "f-value":             float(bp_test[2]),
          "f p-value":           float(bp_test[3])}

    # 7.3 Independencia de errores: Durbin-Watson
    dw = durbin_watson(resid)

    # 7.4 Multicolinealidad: VIF
    vif = []
    for i, col in enumerate(X_const.columns):
        if col == 'const': continue
        vif.append({
            "variable": col,
            "VIF":      float(variance_inflation_factor(X_const.values, i))
        })

    # 7.5 Influencia de puntos: Cook's distance
    influence = model.get_influence()
    cooks_d, _  = influence.cooks_distance
    cooks_list  = [float(x) for x in cooks_d]

    # 8. Coeficientes y p-valores de cada variable
    coefs = []
    for var in model.params.index:
        coefs.append({
            "variable": var,
            "coef":     float(model.params[var]),
            "p_value":  float(model.pvalues[var])
        })

    # Conclusión global
    conclusion = (
        "Rechazamos H0: el modelo es significativo"
        if f_pvalue < alpha else
        "No rechazamos H0: el modelo no es significativo"
    )

    return {
        "ok":           True,
        "n_obs":        int(model.nobs),
        "n_vars":       int(len(model.params)-1),
        "r2":           round(r2, 4),
        "r2_adj":       round(r2_adj, 4),
        "f_statistic":  round(f_stat, 4),
        "f_pvalue":     round(f_pvalue, 4),
        "anova":        anova,
        "coefs":        coefs,
        "normality": {
            "shapiro_stat": round(sw_stat, 4),
            "shapiro_p":    round(sw_p, 4),
            "ks_stat":      round(ks_stat, 4),
            "ks_p":         round(ks_p, 4),
        },
        "breusch_pagan": bp,
        "durbin_watson": round(dw, 4),
        "vif":          vif,
        "cooks_distance": cooks_list,
        "conclusion":   conclusion
    }
