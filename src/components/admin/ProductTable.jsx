import React, { useEffect, useState } from "react";
import axios from "axios"; // or your axiosConfig
import ReactPaginate from "react-paginate";
import "../../style/product-table.scss";

const defaultFilters = {
  order_status: "",
  region: "",
  city: "",
  assigned: "",
};

export default function ProductTable() {
  // Product data & pagination
  const [products, setProducts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  // Cascade filter data
  const [regions, setRegions] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);

  // Couriers list
  const [couriers, setCouriers] = useState([]);

  // Filter states
  const [filterInput, setFilterInput] = useState({ ...defaultFilters });
  const [filters, setFilters] = useState({ ...defaultFilters });

  // Loading & error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // On mount, fetch region/city/couriers
  useEffect(() => {
    fetchRegions();
    fetchCities();
    fetchCouriers();
  }, []);

  // Re-fetch products when filters or currentPage changes
  useEffect(() => {
    fetchProducts(currentPage);
  }, [filters, currentPage]);

  // -------------- FETCH FUNCTIONS --------------
  const fetchProducts = async (pageNumber) => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access");
      const params = { ...filters, page: pageNumber };
      const response = await axios.get(
        "http://localhost:8000/api/accounts/products/",
        {
          headers: { Authorization: `Bearer ${token}` },
          params,
        }
      );
      // DRF paginated => { count, next, previous, results }
      const data = response.data;
      setProducts(data.results || []);
      setTotalCount(data.count || 0);
      const pages = Math.ceil((data.count || 0) / 10);
      setPageCount(pages);
    } catch (err) {
      setError(err.message || "Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  const fetchRegions = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(
        "http://localhost:8000/api/accounts/regions/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = Array.isArray(res.data.results)
        ? res.data.results
        : res.data;
      setRegions(data);
    } catch (err) {
      console.error("Error fetching regions:", err);
    }
  };

  const fetchCities = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(
        "http://localhost:8000/api/accounts/cities/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = Array.isArray(res.data.results)
        ? res.data.results
        : res.data;
      setAllCities(data);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  const fetchCouriers = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(
        "http://localhost:8000/api/accounts/couriers/",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Might be paginated => handle .results if so
      const data = Array.isArray(res.data.results)
        ? res.data.results
        : res.data;
      setCouriers(data);
    } catch (err) {
      console.error("Error fetching couriers:", err);
    }
  };

  // -------------- CASCADE FILTER LOGIC --------------
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterInput((prev) => ({ ...prev, [name]: value }));

    // Cascade logic for region -> city
    if (name === "region") {
      setFilterInput((prev) => ({ ...prev, city: "" }));
      if (value) {
        const regionId = parseInt(value, 10);
        const filtered = allCities.filter((c) => {
          if (typeof c.region === "number") {
            return c.region === regionId;
          } else if (c.region && typeof c.region.id === "number") {
            return c.region.id === regionId;
          }
          return false;
        });
        setFilteredCities(filtered);
      } else {
        setFilteredCities([]);
      }
    }
  };

  // -------------- FILTER & PAGINATION --------------
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setFilters({ ...filterInput });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilterInput({ ...defaultFilters });
    setFilters({ ...defaultFilters });
    setFilteredCities([]);
    setCurrentPage(1);
  };

  const handlePageClick = (data) => {
    const selectedPage = data.selected + 1;
    setCurrentPage(selectedPage);
  };

  // -------------- ASSIGN/EDIT ASSIGNING --------------
  // If user changes courier in dropdown
  const handleAssignCourier = async (productId, courierId) => {
    try {
      const token = localStorage.getItem("access");
      // Patch the product's assigned_to
      await axios.patch(
        `http://localhost:8000/api/accounts/products/${productId}/`,
        { assigned_to: courierId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh list
      fetchProducts(currentPage);
    } catch (err) {
      alert(
        "Error assigning courier: " +
          (err.response?.data?.detail || err.message)
      );
    }
  };

  // For each product's city, find the couriers that cover it
  const getEligibleCouriers = (product) => {
    if (!product.city) return [];
    const cityId =
      typeof product.city === "number" ? product.city : product.city.id;
    return couriers.filter((courier) => {
      // If covered_cities is an array of IDs or city objects
      if (!courier.covered_cities) return false;
      return courier.covered_cities.some((c) => {
        if (typeof c === "number") return c === cityId;
        // Or if c is object { id: N, name: "..."}
        return c.id === cityId;
      });
    });
  };

  // Get current assigned courier's ID
  const getAssignedCourierId = (product) => {
    if (!product.assigned_to) return "";
    // If assigned_to is an ID or an object
    return typeof product.assigned_to === "number"
      ? product.assigned_to
      : product.assigned_to.id;
  };

  if (loading) return <div className="product-table">Loading products...</div>;
  if (error) return <div className="product-table">Error: {error}</div>;

  return (
    <div className="product-table">
      <div className="filter-bar">
        <form onSubmit={handleFilterSubmit}>
          <label>
            Order Status:
            <select
              name="order_status"
              value={filterInput.order_status}
              onChange={handleFilterChange}
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
            <select
              name="region"
              value={filterInput.region}
              onChange={handleFilterChange}
            >
              <option value="">-- Select Region --</option>
              {regions.map((reg) => (
                <option key={reg.id} value={reg.id}>
                  {reg.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            City:
            <select
              name="city"
              value={filterInput.city}
              onChange={handleFilterChange}
              disabled={!filterInput.region}
            >
              <option value="">-- Select City --</option>
              {filteredCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </label>

          <label>
            Assigned:
            <select
              name="assigned"
              value={filterInput.assigned}
              onChange={handleFilterChange}
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

      <table className="minimal-table">
        <thead>
          <tr>
            <th>Order #</th>
            <th>Date</th>
            <th>Address</th>
            <th>Region</th>
            <th>City</th>
            <th>Phone</th>
            <th>Order Status</th>
            <th>Assigned Courier</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const assignedCourierId = getAssignedCourierId(p);
            const eligibleCouriers = getEligibleCouriers(p);

            // If the assigned courier isn't in the eligible list, add it
            if (
              assignedCourierId &&
              !eligibleCouriers.some((c) => c.id === assignedCourierId)
            ) {
              const assignedCourier = couriers.find(
                (c) => c.id === assignedCourierId
              );
              if (assignedCourier) {
                eligibleCouriers.push(assignedCourier);
              }
            }

            return (
              <tr key={p.id}>
                <td>{p.order_number}</td>
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td>{p.address}</td>
                <td>{p.region_name}</td>
                <td>{p.city_name}</td>
                <td>{p.phone_number}</td>
                <td>{p.order_status}</td>
                <td>
                  <select
                    value={assignedCourierId}
                    onChange={(e) => handleAssignCourier(p.id, e.target.value)}
                  >
                    <option value="">-- Assign Courier --</option>
                    {eligibleCouriers.length > 0 ? (
                      eligibleCouriers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.user && c.user.full_name
                            ? c.user.full_name
                            : `Courier ${c.id}`}
                        </option>
                      ))
                    ) : (
                      <option disabled>No eligible courier</option>
                    )}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={"← Previous"}
        nextLabel={"Next →"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={1}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
      />
    </div>
  );
}
