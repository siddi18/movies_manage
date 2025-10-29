import { useEffect, useState } from "react";
import axios from "axios";
import Modal from "./Modal";
import MovieForm from "./MovieForm";
import ConfirmationModal from "./ConfirmationModal";

type Movie = {
  id: number;
  title: string;
  type: string;
  director: string;
  budget: string;
  location: string;
  duration: string;
  yearTime: string;
  imageUrl?: string;
};

export default function MovieTable() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  
  // Confirmation modal state
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching movies from http://localhost:5000/movies");
      const res = await axios.get("http://localhost:5000/movies");
      console.log("Movies received:", res.data);
      setMovies(res.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError("Failed to load movies. Make sure the backend server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (movie: Movie) => {
    setMovieToDelete(movie);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!movieToDelete) return;
    
    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:5000/movies/${movieToDelete.id}`);
      loadMovies();
      setIsConfirmModalOpen(false);
      setMovieToDelete(null);
    } catch (error) {
      console.error("Error deleting movie:", error);
      alert("Failed to delete movie. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmModalOpen(false);
    setMovieToDelete(null);
  };

  const handleAddSuccess = () => {
    setIsModalOpen(false);
    setEditingMovie(null);
    setModalMode('add');
    loadMovies(); // Refresh the table
  };

  const handleOpenModal = () => {
    console.log("Opening modal...");
    setModalMode('add');
    setEditingMovie(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (movie: Movie) => {
    setModalMode('edit');
    setEditingMovie(movie);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMovie(null);
    setModalMode('add');
  };

  useEffect(() => {
    loadMovies();
  }, []);

  if (loading) {
    return (
      <>
        <div className="flex justify-center items-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your movie collection...</p>
          </div>
        </div>

        {/* Keep modal markup available even during loading so it can open */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={modalMode === 'edit' ? 'Edit Movie' : 'Add New Movie'}
        >
          <MovieForm mode={modalMode} movie={editingMovie} onSuccess={handleAddSuccess} onCancel={handleCloseModal} />
        </Modal>

        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Movie"
          message={`Are you sure you want to delete "${movieToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={isDeleting}
        />
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <div className="text-red-600 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-800 font-medium mb-4">{error}</p>
          <button 
            onClick={loadMovies}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={modalMode === 'edit' ? 'Edit Movie' : 'Add New Movie'}
        >
          <MovieForm mode={modalMode} movie={editingMovie} onSuccess={handleAddSuccess} onCancel={handleCloseModal} />
        </Modal>

        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Movie"
          message={`Are you sure you want to delete "${movieToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={isDeleting}
        />
      </>
    );
  }

  if (movies.length === 0) {
    return (
      <>
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="text-gray-400 mb-6">
            <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4zM9 6v11a1 1 0 102 0V6a1 1 0 10-2 0zm4 0v11a1 1 0 102 0V6a1 1 0 10-2 0z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Movies Yet</h3>
          <p className="text-gray-600 mb-6">Start building your collection by adding your first movie!</p>
          <button 
            onClick={handleOpenModal}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg flex items-center gap-2 mx-auto transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Your First Movie
          </button>
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          title={modalMode === 'edit' ? 'Edit Movie' : 'Add New Movie'}
        >
          <MovieForm mode={modalMode} movie={editingMovie} onSuccess={handleAddSuccess} onCancel={handleCloseModal} />
        </Modal>

        <ConfirmationModal
          isOpen={isConfirmModalOpen}
          onClose={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title="Delete Movie"
          message={`Are you sure you want to delete "${movieToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="danger"
          isLoading={isDeleting}
        />
      </>
    );
  }

  return (
    <div>
      {/* Header with Stats and Add Button */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Collection</h2>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>{movies.length} {movies.length === 1 ? 'Movie' : 'Movies'}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Organized & Managed</span>
              </div>
            </div>
          </div>
          <button
            onClick={handleOpenModal}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-xl flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Movie
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Movie</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Director</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Budget</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Year</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {movies.map((m) => (
              <tr key={m.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200">
                <td className="px-6 py-6 whitespace-nowrap">
                  <div className="flex flex-col items-start">
                    {m.imageUrl ? (
                      <div className="relative group">
                        <img 
                          src={m.imageUrl} 
                          alt={m.title}
                          className="w-16 h-20 object-cover rounded-lg mb-3 shadow-lg group-hover:shadow-xl transition-shadow duration-200"
                          style={{ backgroundColor: 'transparent', mixBlendMode: 'normal', filter: 'none' }}
                        />
                        <div className="absolute inset-0 bg-transparent group-hover:bg-black/10 rounded-lg transition-all duration-200 pointer-events-none"></div>
                      </div>
                    ) : (
                      <div className="w-16 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 flex items-center justify-center shadow-md">
                        <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z"/>
                        </svg>
                      </div>
                    )}
                    <div className="text-sm font-semibold text-gray-900 max-w-32 truncate">{m.title}</div>
                  </div>
                </td>
                <td className="px-6 py-6 whitespace-nowrap">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {m.type}
                  </span>
                </td>
                <td className="px-6 py-6 whitespace-nowrap text-sm font-medium text-gray-700">{m.director}</td>
                <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-600 font-mono">{m.budget}</td>
                <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-600">{m.location}</td>
                <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-600">{m.duration}</td>
                <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-600">{m.yearTime}</td>
                <td className="px-6 py-6 whitespace-nowrap text-center">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(m)}
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(m)}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={modalMode === 'edit' ? "Edit Movie" : "Add New Movie"}
      >
        <MovieForm 
          mode={modalMode}
          movie={editingMovie}
          onSuccess={handleAddSuccess}
          onCancel={handleCloseModal}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Delete Movie"
        message={`Are you sure you want to delete "${movieToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}