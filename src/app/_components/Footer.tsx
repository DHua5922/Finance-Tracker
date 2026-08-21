export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 text-sm text-slate-400">
        <span>© 2026 FinanceFlow</span>
        
        <button
          type="button"
          className="hover:text-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-slate-600"
        >
          Contact
        </button>
      </div>
    </footer>
  );
}
