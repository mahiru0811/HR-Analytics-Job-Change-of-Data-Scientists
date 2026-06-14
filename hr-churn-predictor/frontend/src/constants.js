// ── Dropdown options ────────────────────────────────────────────────────────

export const GENDER_OPTIONS = [
  { value: "", label: "— Không chọn —" },
  { value: "Male",   label: "Nam (Male)" },
  { value: "Female", label: "Nữ (Female)" },
  { value: "Other",  label: "Khác (Other)" },
];

export const EDUCATION_OPTIONS = [
  { value: "", label: "— Không chọn —" },
  { value: "Primary School", label: "Tiểu học (Primary School)" },
  { value: "High School",    label: "THPT (High School)" },
  { value: "Graduate",       label: "Đại học (Graduate)" },
  { value: "Masters",        label: "Thạc sĩ (Masters)" },
  { value: "Phd",            label: "Tiến sĩ (PhD)" },
];

export const MAJOR_OPTIONS = [
  { value: "", label: "— Không chọn —" },
  { value: "STEM",            label: "STEM" },
  { value: "Business Degree", label: "Kinh doanh (Business Degree)" },
  { value: "Arts",            label: "Nghệ thuật (Arts)" },
  { value: "Humanities",      label: "Nhân văn (Humanities)" },
  { value: "No Major",        label: "Không có chuyên ngành (No Major)" },
  { value: "Other",           label: "Khác (Other)" },
];

export const UNIVERSITY_OPTIONS = [
  { value: "", label: "— Không chọn —" },
  { value: "no_enrollment",     label: "Không học (No Enrollment)" },
  { value: "Full time course",  label: "Toàn thời gian (Full time)" },
  { value: "Part time course",  label: "Bán thời gian (Part time)" },
];

export const EXPERIENCE_OPTIONS = [
  { value: "", label: "— Không chọn —" },
  { value: "<1",  label: "Dưới 1 năm (<1)" },
  { value: "1",   label: "1 năm" },
  { value: "2",   label: "2 năm" },
  { value: "3",   label: "3 năm" },
  { value: "4",   label: "4 năm" },
  { value: "5",   label: "5 năm" },
  { value: "6",   label: "6 năm" },
  { value: "7",   label: "7 năm" },
  { value: "8",   label: "8 năm" },
  { value: "9",   label: "9 năm" },
  { value: "10",  label: "10 năm" },
  { value: "11",  label: "11 năm" },
  { value: "12",  label: "12 năm" },
  { value: "13",  label: "13 năm" },
  { value: "14",  label: "14 năm" },
  { value: "15",  label: "15 năm" },
  { value: "16",  label: "16 năm" },
  { value: "17",  label: "17 năm" },
  { value: "18",  label: "18 năm" },
  { value: "19",  label: "19 năm" },
  { value: "20",  label: "20 năm" },
  { value: ">20", label: "Trên 20 năm (>20)" },
];

export const LAST_JOB_OPTIONS = [
  { value: "", label: "— Không chọn —" },
  { value: "never", label: "Chưa từng (Never)" },
  { value: "1",     label: "1 năm" },
  { value: "2",     label: "2 năm" },
  { value: "3",     label: "3 năm" },
  { value: "4",     label: "4 năm" },
  { value: ">4",    label: "Hơn 4 năm (>4)" },
];

export const COMPANY_SIZE_OPTIONS = [
  { value: "", label: "— Không rõ (Unknown) —" },
  { value: "<10",       label: "Dưới 10 người (<10)" },
  { value: "10/49",     label: "10 – 49 người" },
  { value: "50-99",     label: "50 – 99 người" },
  { value: "100-500",   label: "100 – 500 người" },
  { value: "500-999",   label: "500 – 999 người" },
  { value: "1000-4999", label: "1,000 – 4,999 người" },
  { value: "5000-9999", label: "5,000 – 9,999 người" },
  { value: "10000+",    label: "Trên 10,000 người (10000+)" },
];

export const COMPANY_TYPE_OPTIONS = [
  { value: "", label: "— Không rõ (Unknown) —" },
  { value: "Pvt Ltd",            label: "Công ty tư nhân (Pvt Ltd)" },
  { value: "Funded Startup",     label: "Startup đã gọi vốn (Funded Startup)" },
  { value: "Early Stage Startup",label: "Startup giai đoạn đầu (Early Stage)" },
  { value: "Public Sector",      label: "Nhà nước (Public Sector)" },
  { value: "NGO",                label: "Tổ chức phi lợi nhuận (NGO)" },
  { value: "Other",              label: "Khác (Other)" },
];

export const RELEVENT_EXP_OPTIONS = [
  { value: "", label: "— Không chọn —" },
  { value: "Has relevent experience", label: "Có kinh nghiệm liên quan" },
  { value: "No relevent experience",  label: "Chưa có kinh nghiệm liên quan" },
];

export const CITY_LIST = [
  "city_1","city_2","city_7","city_9","city_10","city_11","city_12","city_13",
  "city_14","city_16","city_18","city_19","city_20","city_21","city_23","city_24",
  "city_25","city_26","city_27","city_28","city_30","city_31","city_33","city_36",
  "city_37","city_39","city_40","city_41","city_42","city_43","city_44","city_45",
  "city_46","city_48","city_50","city_53","city_54","city_55","city_57","city_59",
  "city_61","city_62","city_64","city_65","city_67","city_69","city_70","city_71",
  "city_72","city_73","city_74","city_75","city_76","city_77","city_78","city_79",
  "city_80","city_81","city_82","city_83","city_84","city_89","city_90","city_91",
  "city_93","city_94","city_97","city_98","city_99","city_100","city_101","city_102",
  "city_103","city_104","city_105","city_106","city_107","city_109","city_111",
  "city_113","city_114","city_115","city_116","city_117","city_118","city_120",
  "city_121","city_123","city_126","city_127","city_128","city_129","city_131",
  "city_133","city_134","city_136","city_138","city_139","city_140","city_141",
  "city_142","city_143","city_144","city_145","city_146","city_149","city_150",
  "city_152","city_155","city_157","city_158","city_159","city_160","city_162",
  "city_165","city_166","city_167","city_173","city_175","city_176","city_179","city_180",
];

export const MODEL_OPTIONS = [
  { value: "logistic_regression", label: "Logistic Regression", color: "#a78bfa", short: "LR" },
  { value: "random_forest",       label: "Random Forest",       color: "#34d399", short: "RF" },
  { value: "xgboost",             label: "XGBoost",             color: "#f87171", short: "XGB" },
  { value: "lightgbm",            label: "LightGBM",            color: "#fbbf24", short: "LGBM" },
];

export const API_URL = process.env.REACT_APP_API_URL || "https://hr-churn-api.onrender.com";
