import { useLocation, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    // Clear any state when navigating
    navigate(path, { replace: true, state: undefined });
  };

  return (
    <nav className="bg-gray-800 text-white h-16 fixed top-0 left-0 right-0">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <button
            onClick={() => handleNavigation('/list-items')}
            className={`hover:text-gray-300 ${
              location.pathname === '/list-items' ? 'text-white' : 'text-gray-300'
            }`}
          >
            Items List
          </button>
          
          <button
            onClick={() => handleNavigation('/create-item')}
            className={`hover:text-gray-300 ${
              location.pathname === '/create-item' ? 'text-white' : 'text-gray-300'
            }`}
          >
            Add Item
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;