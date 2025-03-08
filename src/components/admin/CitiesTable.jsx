import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "../../axiosConfig"; // Ensure axiosConfig is set up for your project
import "../../style/cities_table.scss";

const CitiesTable = () => {
  // States
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // items per page
  const [totalCount, setTotalCount] = useState(0);

  const token = localStorage.getItem("access");

  // Fetch cities from your API (DRF pagination assumed)
  const fetchCities = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get("/accounts/cities/", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          page_size: pageSize,
        },
      });

      // DRF paginated response
      if (response.data.results) {
        setCities(response.data.results);
        setTotalCount(response.data.count);
      }
      // If your backend returns a plain array
      else if (Array.isArray(response.data)) {
        setCities(response.data);
        setTotalCount(response.data.length);
      } else {
        console.warn("Unexpected city data format:", response.data);
        setCities([]);
      }
      setLoading(false);
    } catch (err) {
      setError("Error fetching cities");
      setLoading(false);
    }
  };

  // On mount, fetch page 1
  useEffect(() => {
    fetchCities(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle user clicking a page in react-paginate
  const handlePageClick = (selectedObj) => {
    const newPage = selectedObj.selected + 1; // react-paginate uses 0-based indices
    setCurrentPage(newPage);
    fetchCities(newPage);
  };

  if (loading) return <div className="cities-table">Loading cities...</div>;
  if (error) return <div className="cities-table">Error: {error}</div>;

  // Calculate total pages
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    <div className="cities-table">
      <h2>Cities</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Region</th>
          </tr>
        </thead>
        <tbody>
          {cities.map((city) => (
            <tr key={city.id}>
              <td>{city.id}</td>
              <td>{city.name}</td>
              <td>{city.region ? city.region.name : "(no region)"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination UI */}
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={pageCount}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          forcePage={currentPage - 1} // keep pagination in sync
        />
      )}
    </div>
  );
};

export default CitiesTable;
