import "./Filter.css";

import { useState } from "react";

function Filter({ onFilter = () => {} }) {
  const [filterBy, setFilterBy] = useState(null);

  const handleClick = (e) => {
    const newFilterValue = filterBy === e.target.value ? null : e.target.value; // learn

    setFilterBy(newFilterValue);
    onFilter(newFilterValue);
  };

  return (
    <div className="filter">
      Filter by:
      <button
        onClick={handleClick}
        className={filterBy === "unread" && "active"}
        value="unread"
      >
        Unread
      </button>
      <button
        onClick={handleClick}
        className={filterBy === "read" && "active"}
        value="read"
      >
        Read
      </button>
      <button
        onClick={handleClick}
        className={filterBy === "favorite" && "active"}
        value="favorite"
      >
        Favorites
      </button>
    </div>
  );
}

export default Filter;
