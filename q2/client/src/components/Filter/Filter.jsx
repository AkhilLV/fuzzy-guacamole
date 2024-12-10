import "./Filter.css";

function Filter({
  filterValues = [],
  filterCategory = "",
  setFilters,
  filters,
}) {
  const filterBy = filters[filterCategory];

  const handleClick = (e) => {
    const newFilterValue = filterBy === e.target.value ? null : e.target.value;

    setFilters((prev) => ({
      ...prev,
      [filterCategory]: newFilterValue,
    }));
  };

  return (
    <div className="filter">
      Filter by {filterCategory}:
      {filterValues.map((value) => (
        <button
          onClick={handleClick}
          className={filterBy === value && "active"}
          value={value}
          key={value}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

export default Filter;
