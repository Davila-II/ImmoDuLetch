export default function TextField({ id, label, error, icon: Icon, className = '', ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-slate-700 mb-1">
        {label}
      </label>
      <div className="relative">
        {Icon && <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />}
        <input
          id={id}
          {...inputProps}
          className={`w-full ${Icon ? 'pl-9 pr-3' : 'px-3'} py-2 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-[#0A1931] ${
            error ? 'border-rose-400' : 'border-slate-200'
          } ${className}`}
        />
      </div>
      {error && <p className="text-[11px] text-rose-600 mt-1">{error}</p>}
    </div>
  );
}