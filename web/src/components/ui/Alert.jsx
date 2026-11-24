const TONES = {
  error: 'bg-rose-50 text-rose-700 border-rose-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  info: 'bg-amber-50 text-amber-900 border-amber-200',
};

export default function Alert({ tone = 'error', className = '', children }) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`text-xs p-3 rounded-lg border ${TONES[tone]} ${className}`}>
      {children}
    </div>
  );
}