export default function ThemeToggle({ theme, onToggle }) {
  return (
    <div className="theme-toggle" onClick={onToggle}>
      {theme === 'dark' ? '☀️' : '🌙'}
    </div>
  );
}
