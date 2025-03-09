import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "../../axiosConfig"; // or your custom Axios instance
import "../../style/courier_table.scss";

const defaultFilters = {
  order_status: "",
  region: "",
  city: "",
  assigned: "",
};

const CourierTable = () => {
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Number of records per page
  const [totalCount, setTotalCount] = useState(0);

  const token = localStorage.getItem("access");

  // Fetch couriers from your API
  const fetchCouriers = async (page) => {
    setLoading(true);
    try {
      // We pass page & page_size to our DRF endpoint
      const response = await axios.get("/accounts/couriers/", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          page_size: pageSize,
        },
      });

      // If DRF pagination is active, the data has 'count' and 'results'
      if (response.data.results) {
        setCouriers(response.data.results);
        setTotalCount(response.data.count);
      } else if (Array.isArray(response.data)) {
        // If your backend returns a plain array (no pagination)
        setCouriers(response.data);
        setTotalCount(response.data.length);
      } else {
        console.warn("Unexpected courier data format:", response.data);
        setCouriers([]);
      }

      setLoading(false);
    } catch (err) {
      setError("Error fetching couriers");
      setLoading(false);
    }
  };

  // On component mount, fetch page 1
  useEffect(() => {
    fetchCouriers(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handler for page change (react-paginate)
  const handlePageClick = (selectedObj) => {
    const newPage = selectedObj.selected + 1; // react-paginate is 0-based
    setCurrentPage(newPage);
    fetchCouriers(newPage);
  };

  if (loading) return <div className="couriers-table">Loading couriers...</div>;
  if (error) return <div className="couriers-table">Error: {error}</div>;

  // Calculate total pages
  const pageCountCalc = Math.ceil(totalCount / pageSize);

  return (
    <div className="couriers-table">
      <h2>Couriers</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Username</th>
            <th>Covered Cities</th>
            <th>Plain Password</th>
          </tr>
        </thead>
        <tbody>
          {couriers.map((courier) => {
            const fullName =
              courier.user && courier.user.full_name
                ? courier.user.full_name
                : "(No name)";
            const userName =
              courier.user && courier.user.username
                ? courier.user.username
                : "(No username)";

            // Use the new field if provided by the backend
            const citiesDisplay = courier.covered_cities_names
              ? courier.covered_cities_names
              : courier.covered_cities && courier.covered_cities.length > 0
              ? courier.covered_cities
                  .map((city) => (typeof city === "object" ? city.name : city))
                  .join(", ")
              : "(none)";

            return (
              <tr key={courier.id}>
                <td>{courier.id}</td>
                <td>{fullName}</td>
                <td>{userName}</td>
                <td>{citiesDisplay}</td>
                <td>{courier.plain_password || "(none)"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination Component */}
      {pageCountCalc > 1 && (
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={pageCountCalc}
          marginPagesDisplayed={1}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          forcePage={currentPage - 1} // so it highlights the correct page
        />
      )}
    </div>
  );
};

export default CourierTable;
