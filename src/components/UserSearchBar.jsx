// src/components/UserSearchBar.jsx
import { FiSearch } from 'react-icons/fi';

const UserSearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="flex items-center w-full max-w-lg bg-white/20 dark:bg-white/10 backdrop-blur-md px-4 py-2 rounded-full shadow-inner border border-gray-300 dark:border-gray-700">
      <FiSearch className="text-white mr-2" />
      <input
        type="text"
        placeholder="Search jobs"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="flex-1 bg-transparent border-none outline-none placeholder-white text-white"
      />
    </div>
  );
};

export default UserSearchBar;
