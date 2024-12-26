import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CreateItem: React.FC = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const itemToUpdate = location.state as { id: number; title: string; body: string } | undefined;

  // Reset form when route changes
  useEffect(() => {
    if (!location.state) {
      resetForm();
    }
  }, [location]);

  // Initial form population
  useEffect(() => {
    if (itemToUpdate) {
      setTitle(itemToUpdate.title);
      setBody(itemToUpdate.body);
    } else {
      resetForm();
    }
  }, [itemToUpdate]);

  const resetForm = () => {
    setTitle('');
    setBody('');
    // Clear the location state to switch to create mode
    navigate(location.pathname, { replace: true, state: undefined });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let response;

      if (itemToUpdate) {
        response = await fetch(`https://jsonplaceholder.typicode.com/posts/${itemToUpdate.id}`, {
          method: 'PUT',
          body: JSON.stringify({
            id: itemToUpdate.id,
            title,
            body,
            userId: 1,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
      } else {
        response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          body: JSON.stringify({
            title,
            body,
            userId: 1,
          }),
          headers: {
            'Content-type': 'application/json; charset=UTF-8',
          },
        });
      }

      if (!response.ok) {
        throw new Error(`Failed to ${itemToUpdate ? 'update' : 'create'} item`);
      }

      setSuccess(true);
      resetForm();

      setTimeout(() => {
        setSuccess(false);
        navigate('/list-items');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-24">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-6 text-blue-900 pb-2 border-b">
          {itemToUpdate ? 'Update Item' : 'Add Item'}
        </h2>

        {success && (
          <div className="bg-green-500 text-white px-4 py-3 rounded mb-4">
            {itemToUpdate ? 'Item updated successfully!' : 'Item created successfully!'}
          </div>
        )}

        {error && (
          <div className="bg-red-500 text-white px-4 py-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-2 font-medium text-gray-700">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter title"
            />
          </div>

          <div>
            <label htmlFor="body" className="block mb-2 font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
              required
              placeholder="Enter description"
            />
          </div>

          <div className="pt-4 border-t flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 py-2 px-4 text-white rounded ${
                loading ? 'bg-blue-300' : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {loading ? (itemToUpdate ? 'Updating...' : 'Creating...') : itemToUpdate ? 'Update Item' : 'Create Item'}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="w-1/2 py-2 px-4 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;