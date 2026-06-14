# File: backend/transformers/xgboost_transformers.py

import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin

class XGB_MissingValueHandler(BaseEstimator, TransformerMixin):
# Nhóm 1: missing có ý nghĩa → category 'Unknown'
    UNKNOWN_COLS = ['company_size', 'company_type', 'gender']

    # Nhóm 2: không có chuyên ngành ≠ không khai báo → 'No Info'
    NO_INFO_COLS = ['major_discipline']

    # Nhóm 3: missing ngẫu nhiên, tỷ lệ thấp → mode
    MODE_COLS = [
        'relevent_experience',
        'enrolled_university',
        'education_level',
        'experience',
        'last_new_job',
    ]

    # Nhóm 4: biến liên tục có outlier → median
    MEDIAN_COLS = ['city_development_index', 'training_hours']

    def fit(self, X, y=None):
        # Học mode và median CHỈ trên phần Train của mỗi fold
        self.modes_   = {
            col: X[col].mode()[0]
            for col in self.MODE_COLS if col in X.columns
        }
        self.medians_ = {
            col: X[col].median()
            for col in self.MEDIAN_COLS if col in X.columns
        }
        return self

    def transform(self, X, y=None):
        X = X.copy()
        for col in self.UNKNOWN_COLS:
            if col in X.columns:
                X[col] = X[col].fillna('Unknown')
        for col in self.NO_INFO_COLS:
            if col in X.columns:
                X[col] = X[col].fillna('No Info')
        for col, val in self.modes_.items():
            if col in X.columns:
                X[col] = X[col].fillna(val)
        for col, val in self.medians_.items():
            if col in X.columns:
                X[col] = X[col].fillna(val)
        return X

class XGB_OrdinalMapper(BaseEstimator, TransformerMixin):
    # education_level: bậc học từ thấp đến cao (0–4)
    _EDUCATION_LEVEL = {
        'Primary School': 0,
        'High School'   : 1,
        'Graduate'      : 2,
        'Masters'       : 3,
        'Phd'           : 4,
    }

    # experience: '<1' → 0, '1'–'20' → 1–20, '>20' → 21
    _EXPERIENCE = {'<1': 0, **{str(i): i for i in range(1, 21)}, '>20': 21}

    # company_size: 'Unknown' = –1 (phân biệt với giá trị hợp lệ nhỏ nhất '<10' = 0)
    _COMPANY_SIZE = {
        'Unknown'   : -1,
        '<10'       :  0,
        '10/49'     :  1,
        '50-99'     :  2,
        '100-500'   :  3,
        '500-999'   :  4,
        '1000-4999' :  5,
        '5000-9999' :  6,
        '10000+'    :  7,
    }

    # last_new_job: 'never' → 0, '1'–'4' → 1–4, '>4' → 5
    _LAST_NEW_JOB = {'never': 0, '1': 1, '2': 2, '3': 3, '4': 4, '>4': 5}

    def fit(self, X, y=None):
        return self

    def transform(self, X, y=None):
        X = X.copy()
        if 'education_level' in X.columns:
            X['education_level'] = X['education_level'].map(self._EDUCATION_LEVEL)
        if 'experience' in X.columns:
            X['experience'] = X['experience'].map(self._EXPERIENCE)
        if 'company_size' in X.columns:
            X['company_size'] = X['company_size'].map(self._COMPANY_SIZE)
        if 'last_new_job' in X.columns:
            X['last_new_job'] = X['last_new_job'].map(self._LAST_NEW_JOB)
        return X

class XGB_FrequencyEncoder(BaseEstimator, TransformerMixin):
    """
    Mã hoá tần suất cho city (123 giá trị duy nhất).
    One-Hot sẽ tạo 123 cột thưa → FrequencyEncoder nén thành 1 cột số ∈ [0, 1].
    Thành phố không có trong tập Train → tần suất mặc định = 0.0.
    """
    def __init__(self, col='city'):
        self.col = col

    def fit(self, X, y=None):
        
        self.freq_map_ = X[self.col].value_counts(normalize=True).to_dict()
        return self

    def transform(self, X, y=None):
        X = X.copy()
        X[self.col] = X[self.col].map(self.freq_map_).fillna(0.0)
        return X