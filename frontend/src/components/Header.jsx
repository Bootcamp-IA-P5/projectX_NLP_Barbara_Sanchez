import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            🛡️ Hate Speech Detection
          </Link>
          <nav className="flex gap-4">
            <Link 
              to="/" 
              className="px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Análisis Individual
            </Link>
            <Link 
              to="/batch" 
              className="px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Análisis por Lotes
            </Link>
            <Link 
              to="/youtube" 
              className="px-4 py-2 rounded hover:bg-gray-100 transition"
            >
              Análisis YouTube
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;

