import logo from '../../assets/immo.png';

export default function AuthCard({ title, subtitle, footer, children }) {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
        <div className="text-center space-y-2">
          <img src={logo} alt="Immo du Letch" className="h-14 mx-auto object-contain" />
          <h2 className="text-xl font-extrabold text-[#0A1931]">{title}</h2>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>

        {children}

        {footer && <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">{footer}</div>}
      </div>
    </div>
  );
}