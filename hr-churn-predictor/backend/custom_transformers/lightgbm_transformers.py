import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin


class LightGBM_MissingValueHandler(BaseEstimator, TransformerMixin):
    # THAY ĐỔI 1: Thêm 'company_size', 'company_type' vào UNKNOWN_COLS
    UNKNOWN_COLS = ['gender', 'company_size', 'company_type']
    NO_INFO_COLS = ['major_discipline']
    MODE_COLS    = ['relevent_experience', 'enrolled_university',
                    'education_level', 'experience', 'last_new_job']
    # THAY ĐỔI 2: Thêm MEDIAN_COLS hoàn toàn mới
    MEDIAN_COLS  = ['city_development_index', 'training_hours']

    def fit(self, X, y=None):
        self.modes_ = {
            col: X[col].mode()[0]
            for col in self.MODE_COLS if col in X.columns
        }
        # THAY ĐỔI 3: Thêm block học median từ tập train
        self.medians_ = {
            col: X[col].median()
            for col in self.MEDIAN_COLS if col in X.columns
        }
        return self

    def transform(self, X, y=None):
        X = X.copy()
        for col in self.UNKNOWN_COLS:
            if col in X.columns: X[col] = X[col].fillna('Unknown')
        for col in self.NO_INFO_COLS:
            if col in X.columns: X[col] = X[col].fillna('No Info')
        for col, val in self.modes_.items():
            if col in X.columns: X[col] = X[col].fillna(val)
        # THAY ĐỔI 4: Thêm block impute median + ép float64
        for col, val in self.medians_.items():
            if col in X.columns:
                X[col] = X[col].fillna(val)
                X[col] = X[col].astype(float)
        return X


class LightGBM_CategoricalTypeCaster(BaseEstimator, TransformerMixin):
    def __init__(self, cat_cols):
        self.cat_cols = cat_cols

    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        X = X.copy()
        for col in self.cat_cols:
            if col in X.columns:
                X[col] = X[col].astype('category')
        return X


# THAY ĐỔI 5: Thêm class hoàn toàn mới — FrequencyEncoder cho city
class LightGBM_FrequencyEncoder(BaseEstimator, TransformerMixin):
    def __init__(self, col='city'):
        self.col = col

    def fit(self, X, y=None):
        self.freq_map_ = X[self.col].value_counts(normalize=True).to_dict()
        return self

    def transform(self, X, y=None):
        X = X.copy()
        X[self.col] = X[self.col].map(self.freq_map_).fillna(0.0)
        return X