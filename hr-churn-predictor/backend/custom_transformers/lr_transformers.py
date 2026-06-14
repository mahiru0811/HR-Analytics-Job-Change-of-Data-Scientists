import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
class LR_MissingValueHandler(BaseEstimator, TransformerMixin):
    UNKNOWN_COLS = ['gender', 'company_size', 'company_type']
    NO_INFO_COLS = ['major_discipline']
    MODE_COLS = ['relevent_experience', 'enrolled_university',
                 'education_level', 'experience', 'last_new_job']
    MEDIAN_COLS = ['city_development_index', 'training_hours']

    def fit(self, X, y=None):
        self.modes_ = {col: X[col].mode()[0] for col in self.MODE_COLS if col in X.columns}
        self.medians_ = {col: X[col].median() for col in self.MEDIAN_COLS if col in X.columns}
        return self

    def transform(self, X, y=None):
        X = X.copy()
        for col in self.UNKNOWN_COLS:
            if col in X.columns: X[col] = X[col].fillna('Unknown')
        for col in self.NO_INFO_COLS:
            if col in X.columns: X[col] = X[col].fillna('No Info')
        for col, val in self.modes_.items():
            if col in X.columns: X[col] = X[col].fillna(val)
        for col, val in self.medians_.items():
            if col in X.columns: X[col] = X[col].fillna(val)
        return X
class LR_OrdinalMapper(BaseEstimator, TransformerMixin):
    # Với mô hình tuyến tính, company_size sẽ được One-Hot Encoding thay vì Ordinal
    MAPPINGS = {
        'education_level': {'Primary School':0,'High School':1,'Graduate':2,'Masters':3,'Phd':4},
        'experience' : {'<1':0, **{str(i):i for i in range(1,21)}, '>20':21},
        'last_new_job' : {'never':0,'1':1,'2':2,'3':3,'4':4,'>4':5},
    }
    def fit(self, X, y=None): return self
    def transform(self, X, y=None):
        X = X.copy()
        for col, mapping in self.MAPPINGS.items():
            if col in X.columns: X[col] = X[col].map(mapping)
        return X

class LR_FrequencyEncoder(BaseEstimator, TransformerMixin):
    def __init__(self, col='city'): self.col = col
    def fit(self, X, y=None):
        
        self.freq_map_ = X[self.col].value_counts(normalize=True).to_dict()
        return self
    def transform(self, X, y=None):
        X = X.copy()
        X[self.col] = X[self.col].map(self.freq_map_).fillna(0.0)
        return X