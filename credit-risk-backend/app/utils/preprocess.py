import pandas as pd


def preprocess_input(data, feature_columns):

    df = pd.DataFrame([data])

    # Feature engineering
    df['emi_income_ratio'] = (
        df['installment'] / (df['annual_inc'] + 1)
    )

    df['loan_income_ratio'] = (
        df['loan_amnt'] / (df['annual_inc'] + 1)
    )

    df['credit_stress'] = (
        df['dti'] +
        df['revol_util'] +
        df['bc_util']
    )

    df['credit_behavior_score'] = (
        df['delinq_2yrs'] +
        df['inq_last_6mths'] +
        df['pub_rec']
    )

    # Convert term
    df['term_ 60 months'] = (
        df['term'] == 60
    ).astype(int)

    # One-hot encoding
    categorical_columns = [
        'home_ownership',
        'purpose',
        'application_type'
    ]

    df = pd.get_dummies(
        df,
        columns=categorical_columns,
        drop_first=True
    )

    # Match training columns
    df = df.reindex(
        columns=feature_columns,
        fill_value=0
    )

    return df