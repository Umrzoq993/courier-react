import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import axios from "../../axiosConfig";
import "../../style/product-table.scss";

const defaultFilters = {
  order_status: "",
  region: "",
  city: "",
  assigned: "",
};

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [couriers, setCouriers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // or let user pick
  const [totalCount, setTotalCount] = useState(0);

  // Filter input
  const [filterInput, setFilterInput] = useState({ ...defaultFilters });
  const [filters, setFilters] = useState({ ...defaultFilters });

  const API_URL = "http://localhost:8000/api/accounts/products/";
  const COURIER_URL = "http://localhost:8000/api/accounts/couriers/";
  const token = localStorage.getItem("access");

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      // Merge filters with pagination params
      const params = {
        ...filters,
        page: page,
        page_size: pageSize,
      };
      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      // If using DRF pagination, "results" array contains the items
      setProducts(response.data.results);
      setTotalCount(response.data.count);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Error fetching products");
      setLoading(false);
    }
  };

  const fetchCouriers = async () => {
    try {
      const response = await axios.get(COURIER_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // If backend uses DRF pagination
      // setCouriers(response.data.results);
      // If your backend returns raw array (no pagination), use:
      // setCouriers(response.data);

      // Safest approach: check whether .results exists
      if (Array.isArray(response.data.results)) {
        setCouriers(response.data.results);
      } else if (Array.isArray(response.data)) {
        setCouriers(response.data);
      } else {
        setCouriers([]);
        console.warn("Unexpected format for couriers response:", response.data);
      }
    } catch (err) {
      console.error("Error fetching couriers:", err);
    }
  };

  // Whenever filters or current page change, re-fetch products
  useEffect(() => {
    fetchProducts(currentPage);
    // eslint-disable-next-line
  }, [filters, currentPage]);

  useEffect(() => {
    fetchCouriers();
    // eslint-disable-next-line
  }, []);

  // Filter input handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilterInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    // Reset to page 1 whenever new filters apply
    setCurrentPage(1);
    setFilters({ ...filterInput });
  };

  const handleClearFilters = () => {
    setFilterInput({ ...defaultFilters });
    setFilters({ ...defaultFilters });
    setCurrentPage(1);
  };

  // Change page when user clicks a page in ReactPaginate
  const handlePageClick = (selectedPage) => {
    // 'selected' is zero-based, but DRF expects page=1-based
    setCurrentPage(selectedPage.selected + 1);
  };

  // Handler to assign courier to product
  const handleAssignCourier = async (productId, courierId) => {
    try {
      await axios.patch(
        `${API_URL}${productId}/`,
        { assigned_to: courierId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchProducts(currentPage);
    } catch (err) {
      console.error("Error assigning courier:", err);
    }
  };

  // Get eligible couriers whose covered_cities include the product's city
  const getEligibleCouriers = (productCity) => {
    if (!productCity) return [];
    const cityId =
      typeof productCity === "object"
        ? Number(productCity.id)
        : Number(productCity);
    return couriers.filter((courier) => {
      if (!courier.covered_cities) return false;
      return courier.covered_cities.some((city) => {
        const cId = typeof city === "object" ? Number(city.id) : Number(city);
        return cId === cityId;
      });
    });
  };

  // Determine assigned courier's ID
  const getAssignedCourierId = (product) => {
    if (!product.assigned_to) return "";
    return typeof product.assigned_to === "object"
      ? product.assigned_to.id
      : product.assigned_to;
  };

  if (loading) return <div className="product-list">Loading products...</div>;
  if (error) return <div className="product-list">Error: {error}</div>;

  // Calculate how many total pages are needed for react-paginate
  // (if your DRF PAGE_SIZE is 10, this is totalCount / 10)
  const pageCount = Math.ceil(totalCount / pageSize);

  return (
    <div className="product-list">
      <div className="filter-bar">
        <form onSubmit={handleFilterSubmit}>
          <label>
            Order Status:
            <select
              name="order_status"
              value={filterInput.order_status}
              onChange={handleInputChange}
            >
              <option value="">All</option>
              <option value="Pending">Pending</option>
              <option value="Dispatched">Dispatched</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </label>
          <label>
            Region:
            <input
              type="text"
              name="region"
              placeholder="Region"
              value={filterInput.region}
              onChange={handleInputChange}
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              placeholder="City"
              value={filterInput.city}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Assigned:
            <select
              name="assigned"
              value={filterInput.assigned}
              onChange={handleInputChange}
            >
              <option value="">All</option>
              <option value="assigned">Assigned</option>
              <option value="unassigned">Unassigned</option>
            </select>
          </label>
          <button type="submit">Apply Filters</button>
          <button type="button" onClick={handleClearFilters}>
            Clear Filters
          </button>
        </form>
      </div>

      <table>
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Date</th>
            <th>Address</th>
            <th>Region</th>
            <th>City</th>
            <th>Phone Number</th>
            <th>Order Status</th>
            <th>Assigned Courier</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            let eligibleCouriers = getEligibleCouriers(product.city);
            const currentAssignedId = getAssignedCourierId(product);

            // If assigned courier isn't in the eligible list, add it
            if (
              currentAssignedId &&
              !eligibleCouriers.some((c) => c.id === currentAssignedId)
            ) {
              const assignedCourier = couriers.find(
                (c) => c.id === currentAssignedId
              );
              if (assignedCourier) {
                eligibleCouriers = [...eligibleCouriers, assignedCourier];
              }
            }

            return (
              <tr key={product.id}>
                <td>{product.order_number}</td>
                <td>{new Date(product.date).toLocaleDateString()}</td>
                <td>{product.address}</td>
                <td>{product.region_name}</td>
                <td>{product.city_name}</td>
                <td>{product.phone_number}</td>
                <td>{product.order_status}</td>
                <td>
                  <select
                    className="courier-dropdown"
                    value={currentAssignedId}
                    onChange={(e) =>
                      handleAssignCourier(product.id, e.target.value)
                    }
                  >
                    <option value="">Select Courier</option>
                    {eligibleCouriers.length > 0 ? (
                      eligibleCouriers.map((courier) => (
                        <option key={courier.id} value={courier.id}>
                          {courier.user && courier.user.full_name
                            ? courier.user.full_name
                            : `Courier ${courier.id}`}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No eligible courier
                      </option>
                    )}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination UI */}
      {pageCount > 1 && (
        <ReactPaginate
          previousLabel={"← Previous"}
          nextLabel={"Next →"}
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination"}
          activeClassName={"active"}
          forcePage={currentPage - 1} // because react-paginate is 0-based
        />
      )}
    </div>
  );
};

export default ProductList;
