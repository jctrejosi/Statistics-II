import axios from "axios";

type DataSend = {
  columns: string[];
  data: (string | number | null)[][];
};

export type RegressionResponse = {
  ok: boolean;
  n_obs: number;
  n_vars: number;
  r2: number;
  r2_adj: number;
  f_statistic: number;
  f_pvalue: number;
  anova: {
    [variable: string]: {
      df: number;
      sum_sq: number;
      mean_sq: number;
      F?: number;
      "PR(>F)"?: number;
    };
  };
  coefs: {
    variable: string;
    coef: number;
    p_value: number;
  }[];
  normality: {
    shapiro_stat: number;
    shapiro_p: number;
    ks_stat: number;
    ks_p: number;
  };
  breusch_pagan: {
    "Lagrange multiplier": number;
    "p-value": number;
    "f-value": number;
    "f p-value": number;
  };
  durbin_watson: number;
  vif: {
    variable: string;
    VIF: number;
  }[];
  cooks_distance: number[];
  conclusion: string;
};

export const set_regression = async (data: DataSend) => {
  try {
    const res = await axios.post<RegressionResponse>(
      "http://localhost:5000/api/v1.0/regression",
      data
    );
    return res.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
