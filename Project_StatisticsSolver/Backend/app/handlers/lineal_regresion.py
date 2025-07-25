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
    try:
        # 1. Crear DataFrame
        df = pd.DataFrame(data, columns=columns)

        if dependent not in df.columns:
            return {"ok": False, "error": f"La variable dependiente '{dependent}' no existe en las columnas."}

        # 2. Convertir todo a numérico, forzar errores como NaN
        df = df.apply(pd.to_numeric, errors='coerce')

        # 3. Eliminar filas con NaN
        df = df.dropna()

        if df.empty:
            return {"ok": False, "error": "Los datos están vacíos después de limpiar valores no numéricos o nulos."}

        if len(df) < 5:
            return {"ok": False, "error": "Se requieren al menos 5 observaciones para una regresión confiable."}

        if dependent not in df.columns:
            return {"ok": False, "error": f"La variable dependiente '{dependent}' no está presente en los datos."}

        y = df[dependent]
        X = df.drop(columns=[dependent])

        if X.shape[1] == 0:
            return {"ok": False, "error": "No hay variables independientes (predictoras) disponibles."}

        X_const = sm.add_constant(X)

        # 4. Ajustar modelo
        model = sm.OLS(y, X_const).fit()

        # 5. Estadísticos principales
        r2        = model.rsquared
        r2_adj    = model.rsquared_adj
        f_stat    = model.fvalue
        f_pvalue  = model.f_pvalue

        # 6. ANOVA del modelo
        try:
            anova_tbl = sm.stats.anova_lm(model, typ=2)
            anova = {
                idx: {
                    "df": float(row["df"]),
                    "sum_sq": float(row["sum_sq"]),
                    "mean_sq": float(row["mean_sq"]),
                    "F": float(row.get("F", np.nan)),
                    "PR(>F)": float(row.get("PR(>F)", np.nan))
                }
                for idx, row in anova_tbl.iterrows()
            }
        except Exception as e:
            anova = {"error": "No se pudo calcular tabla ANOVA", "detalle": str(e)}

        # 7. Supuestos
        resid  = model.resid
        fitted = model.fittedvalues

        # 7.1 Normalidad
        sw_stat, sw_p = shapiro(resid)
        ks_stat, ks_p = kstest((resid - resid.mean()) / resid.std(ddof=1), 'norm')

        # 7.2 Breusch–Pagan
        bp_test = het_breuschpagan(resid, X_const)
        bp = {
            "Lagrange multiplier": float(bp_test[0]),
            "p-value": float(bp_test[1]),
            "f-value": float(bp_test[2]),
            "f p-value": float(bp_test[3])
        }

        # 7.3 Durbin-Watson
        dw = durbin_watson(resid)

        # 7.4 VIF
        vif = []
        for i, col in enumerate(X_const.columns):
            if col == 'const':
                continue
            vif_value = variance_inflation_factor(X_const.values, i)
            vif.append({
                "variable": col,
                "VIF": float(vif_value)
            })

        # 7.5 Cook's Distance
        influence = model.get_influence()
        cooks_d, _ = influence.cooks_distance
        cooks_list = [float(x) for x in cooks_d]

        # 8. Coeficientes
        coefs = [{
            "variable": var,
            "coef": float(model.params[var]),
            "p_value": float(model.pvalues[var])
        } for var in model.params.index]

        # 9. Conclusión
        conclusion = (
            "Rechazamos H0: el modelo es significativo"
            if f_pvalue < alpha else
            "No rechazamos H0: el modelo no es significativo"
        )

        return {
            "ok": True,
            "n_obs": int(model.nobs),
            "n_vars": int(len(model.params) - 1),
            "r2": round(r2, 4),
            "r2_adj": round(r2_adj, 4),
            "f_statistic": round(f_stat, 4),
            "f_pvalue": round(f_pvalue, 4),
            "anova": anova,
            "coefs": coefs,
            "normality": {
                "shapiro_stat": round(sw_stat, 4),
                "shapiro_p": round(sw_p, 4),
                "ks_stat": round(ks_stat, 4),
                "ks_p": round(ks_p, 4),
            },
            "breusch_pagan": bp,
            "durbin_watson": round(dw, 4),
            "vif": vif,
            "cooks_distance": cooks_list,
            "conclusion": conclusion
        }

    except Exception as e:
        import traceback
        return {
            "ok": False,
            "error": str(e),
            "trace": traceback.format_exc()
        }
