import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "../../axiosConfig";
import "../../style/regions_table.scss";

const RegionsTable = () => {
  // Region list and loading/error states
  const [regions, setRegions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // How many records per page
  const [totalCount, setTotalCount] = useState(0);

  const token = localStorage.getItem("access");

  // Fetch regions (server-side pagination assumed)
  const fetchRegions = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get("/accounts/regions/", {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          page,
          page_size: pageSize,
        },
      });

      // If DRF pagination is active
      if (response.data.results) {
        setRegions(response.data.results);
        setTotalCount(response.data.count);
      }
      // If a plain array is returned
      else if (Array.isArray(response.data)) {
        setRegions(response.data);
        setTotalCount(response.data.length);
      } else {
        console.warn("Unexpected region data format:", response.data);
        setRegions([]);
      }
      setLoading(false);
    } catch (err) {
      setError("Error fetching regions");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegions(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Called when the user selects a new page in react-paginate
  const handlePageClick = (selectedObj) => {
    const newPage = selectedObj.selected + 1; // react-paginate is zero-based
    setCurrentPage(newPage);
    fetchRegions(newPage);
  };

  if (loading) {
    return <div className="regions-table">Loading regions...</div>;
  }

  if (error) {
    return <div className="regions-table">Error: {error}</div>;
  }

  // Compute total pages
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    <div className="regions-table">
      <h2>Regions</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Region Name</th>
          </tr>
        </thead>
        <tbody>
          {regions.map((region) => (
            <tr key={region.id}>
              <td>{region.id}</td>
              <td>{region.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

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

export default RegionsTable;
