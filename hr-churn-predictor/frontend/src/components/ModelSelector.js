import React from 'react';
import { MODEL_OPTIONS } from '../constants';

export default function ModelSelector({ value, onChange }) {
  const s = {
    wrapper: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
    },
    label: {
      fontSize: '0.78rem',
      fontWeight: '600',
      color: 'var(--text2)',
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '8px',
    },
    btn: (m, active) => ({
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 12px',
      borderRadius: 'var(--radius)',
      border: `1.5px solid ${active ? m.color : 'var(--border)'}`,
      background: active ? `${m.color}18` : 'var(--bg)',
      cursor: 'pointer',
      transition: 'all var(--transition)',
      color: active ? m.color : 'var(--text2)',
      fontFamily: 'var(--font)',
      fontSize: '0.8rem',
      fontWeight: active ? '600' : '400',
    }),
    dot: (color) => ({
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      background: color,
      flexShrink: 0,
    }),
    short: (m, active) => ({
      marginLeft: 'auto',
      fontFamily: 'var(--mono)',
      fontSize: '0.7rem',
      color: active ? m.color : 'var(--text3)',
      background: active ? `${m.color}22` : 'var(--bg3)',
      padding: '1px 6px',
      borderRadius: '4px',
    }),
  };

  return (
    <div style={s.wrapper}>
      <span style={s.label}>Chọn mô hình dự đoán</span>
      <div style={s.grid}>
        {MODEL_OPTIONS.map(m => {
          const active = value === m.value;
          return (
            <button
              key={m.value}
              style={s.btn(m, active)}
              onClick={() => onChange(m.value)}
            >
              <span style={s.dot(m.color)} />
              <span>{m.label}</span>
              <span style={s.short(m, active)}>{m.short}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
