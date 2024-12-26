import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Item {
  id: number;
  title: string;
  body: string;
}

const ListItems: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortDirection, setSortDirection] = useState<'ascending' | 'descending'>('ascending');
  const [mounted, setMounted] = useState(false);

  const navigate = useNavigate();

  // Initial mounting effect
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Separate effect for data fetching with debounce
  useEffect(() => {
    if (!mounted) return;

    const fetchItems = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!response.ok) throw new Error('Failed to fetch items');
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay before fetching to prevent API call collision
    const timer = setTimeout(fetchItems, 100);
    return () => clearTimeout(timer);
  }, [mounted]);

  // Filter and sort items when items, searchTerm, or sortDirection changes
  useEffect(() => {
    let result = [...items];

    if (searchTerm) {
      result = result.filter(
        item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    result.sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return sortDirection === 'ascending' ? comparison : -comparison;
    });

    setFilteredItems(result);
  }, [items, searchTerm, sortDirection]);

  // Success message cleanup
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleUpdateClick = (item: Item) => {
    navigate('/create-item', { state: item });
  };

  const handleDeleteClick = (id: number) => {
    setItemToDelete(id);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete === null) return;

    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${itemToDelete}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete item');
      setItems(items.filter(item => item.id !== itemToDelete));
      setShowSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
    } finally {
      setShowConfirmation(false);
      setItemToDelete(null);
    }
  };

  // Loading state should be minimal or not visible during navigation
  if (loading && !items.length) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4 text-blue-900 mt-24">Items List</h1>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Rest of your existing JSX remains exactly the same */}
      {showSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-opacity">
          Item deleted successfully!
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4 text-blue-900 mt-24">Items List</h1>

      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-24"
          />
          <button
            onClick={() => setSortDirection(prev => prev === 'ascending' ? 'descending' : 'ascending')}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors flex items-center space-x-1"
          >
            <span>Sort</span>
            <span>{sortDirection === 'ascending' ? '↑' : '↓'}</span>
          </button>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredItems.length === 0 ? (
          <div className="text-center text-gray-500 py-8">No items found</div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="mt-2 text-gray-600">{item.body}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleUpdateClick(item)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteClick(item.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this item?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setItemToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListItems;