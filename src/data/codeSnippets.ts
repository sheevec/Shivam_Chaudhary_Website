export interface CodeSnippet {
  id: string
  title: string
  lang: string
  code: string
}

export const codeSnippets: CodeSnippet[] = [
  {
    id: 'spark-batch',
    title: 'Partitioned PySpark write (idempotent)',
    lang: 'python',
    code: `def write_curated(df, path: str, keys: list[str]):
    (
        df.repartition(*keys)
        .write.mode("overwrite")
        .partitionBy(*keys)
        .parquet(path)
    )`,
  },
  {
    id: 'sql-window',
    title: 'Windowed fraud velocity feature',
    lang: 'sql',
    code: `SELECT
  user_id,
  SUM(amount) OVER (
    PARTITION BY user_id
    ORDER BY txn_ts
    ROWS BETWEEN 23 PRECEDING AND CURRENT ROW
  ) AS rolling_24h_amt
FROM transactions;`,
  },
  {
    id: 'airflow-sla',
    title: 'Airflow SLA sensor pattern',
    lang: 'python',
    code: `with DAG("risk_features_daily", schedule="@daily") as dag:
    upstream = ExternalTaskSensor(
        task_id="wait_for_landing",
        external_dag_id="landing_batch",
        external_task_id="done",
        timeout=60 * 45,
    )
    features = PythonOperator(task_id="build_features", python_callable=build)`,
  },
]
