import React from 'react';

const styles = {
  group: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: 'var(--text2)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  },
  labelRequired: {
    color: 'var(--accent)',
    marginLeft: '2px',
  },
  hint: {
    fontSize: '0.73rem',
    color: 'var(--text3)',
    marginTop: '-2px',
  },
  sliderRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  sliderVal: {
    fontFamily: 'var(--mono)',
    fontSize: '0.85rem',
    color: 'var(--accent)',
    minWidth: '48px',
    textAlign: 'right',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '2px 8px',
    borderRadius: '20px',
    fontSize: '0.7rem',
    fontWeight: '600',
    background: 'rgba(79,142,247,0.15)',
    color: 'var(--accent2)',
    marginLeft: '6px',
  },
};

// ── Select Field ─────────────────────────────────────────────────────────────
export function SelectField({ label, hint, required, badge, value, onChange, options }) {
  return (
    <div style={styles.group}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.labelRequired}>*</span>}
        {badge && <span style={styles.badge}>{badge}</span>}
      </label>
      {hint && <span style={styles.hint}>{hint}</span>}
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

// ── Searchable City Select ───────────────────────────────────────────────────
export function CitySelect({ value, onChange, cities }) {
  const [search, setSearch] = React.useState('');
  const [open, setOpen]     = React.useState(false);
  const ref = React.useRef(null);

  const filtered = cities.filter(c =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  React.useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const containerStyle = {
    position: 'relative',
  };
  const inputStyle = {
    cursor: 'pointer',
    background: 'var(--bg)',
    border: `1.5px solid ${open ? 'var(--accent)' : 'var(--border)'}`,
    boxShadow: open ? '0 0 0 3px rgba(79,142,247,0.15)' : 'none',
  };
  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 4px)',
    left: 0, right: 0,
    background: 'var(--bg3)',
    border: '1.5px solid var(--border2)',
    borderRadius: 'var(--radius)',
    zIndex: 100,
    maxHeight: '220px',
    overflowY: 'auto',
    boxShadow: 'var(--shadow-lg)',
  };
  const searchStyle = {
    padding: '8px 12px',
    borderBottom: '1px solid var(--border)',
    position: 'sticky',
    top: 0,
    background: 'var(--bg3)',
  };
  const itemStyle = (active) => ({
    padding: '8px 12px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    color: active ? 'var(--accent2)' : 'var(--text)',
    background: active ? 'rgba(79,142,247,0.1)' : 'transparent',
    fontFamily: 'var(--mono)',
  });
  const emptyStyle = {
    padding: '12px',
    color: 'var(--text3)',
    fontSize: '0.85rem',
    textAlign: 'center',
  };

  return (
    <div style={styles.group}>
      <label style={styles.label}>
        Thành phố (City)
        <span style={styles.badge}>123 thành phố</span>
      </label>
      <div ref={ref} style={containerStyle}>
        <input
          readOnly
          value={value || ''}
          placeholder="— Nhấn để chọn thành phố —"
          style={inputStyle}
          onClick={() => setOpen(o => !o)}
        />
        {open && (
          <div style={dropdownStyle}>
            <div style={searchStyle}>
              <input
                autoFocus
                placeholder="Tìm kiếm..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '6px 10px', borderRadius: '6px' }}
              />
            </div>
            <div
              style={itemStyle(value === '')}
              onMouseDown={() => { onChange(''); setOpen(false); setSearch(''); }}
            >— Không chọn —</div>
            {filtered.length === 0 && <div style={emptyStyle}>Không tìm thấy</div>}
            {filtered.map(c => (
              <div
                key={c}
                style={itemStyle(value === c)}
                onMouseDown={() => { onChange(c); setOpen(false); setSearch(''); }}
              >{c}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Slider Field ─────────────────────────────────────────────────────────────
export function SliderField({ label, hint, min, max, step=0.01, value, onChange, format }) {
  const display = format ? format(value) : value;
  return (
    <div style={styles.group}>
      <label style={styles.label}>{label}</label>
      {hint && <span style={styles.hint}>{hint}</span>}
      <div style={styles.sliderRow}>
        <input
          type="range"
          min={min} max={max} step={step}
          value={value ?? min}
          onChange={e => onChange(parseFloat(e.target.value))}
          style={{ flex: 1 }}
        />
        <span style={styles.sliderVal}>{display}</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text3)', marginTop: '-4px' }}>
        <span>{format ? format(min) : min}</span>
        <span>{format ? format(max) : max}</span>
      </div>
    </div>
  );
}

// ── Number Field ─────────────────────────────────────────────────────────────
export function NumberField({ label, hint, min, max, value, onChange, unit }) {
  return (
    <div style={styles.group}>
      <label style={styles.label}>{label}</label>
      {hint && <span style={styles.hint}>{hint}</span>}
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          min={min} max={max}
          value={value ?? ''}
          placeholder={`${min} – ${max}`}
          onChange={e => {
            const v = e.target.value === '' ? null : parseInt(e.target.value);
            onChange(v);
          }}
          style={{ paddingRight: unit ? '48px' : '12px' }}
        />
        {unit && (
          <span style={{
            position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text3)', fontSize: '0.78rem', pointerEvents: 'none',
          }}>{unit}</span>
        )}
      </div>
    </div>
  );
}
