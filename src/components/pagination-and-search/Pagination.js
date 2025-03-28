import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import "./Pagination.css";

// inputtext => search => filter result =>
// pagination => 1 2 3 4 5 6 7 8 9
const Pagination = () => {
  const limit = 20;

  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);

  const [noOfPages, setNoOfPages] = useState(0);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [inputText, setInputText] = useState();

  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchData = async () => {
    const url = `https://dummyjson.com/products?limit=${limit}&skip=${
      currentPage * limit
    }`;

    const result = await fetch(url);

    const data = await result.json();

    setProducts(data.products);
    setFilteredProducts(data.products);
    setNoOfPages(Math.ceil(data.total / limit));
  };
  const handleInputSearch = (text) => {
    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      if (text.length === 0) {
        setFilteredProducts(products);
      } else {
        const filtered = products.filter((product) =>
          product.title.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredProducts(filtered);
      }
    }, 300); // Adjust delay as needed (300ms is common)

    setSearchTimeout(timeout);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
    handleInputSearch(e.target.value);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const handleSearch = () => {
    if (inputText.length === "") {
      setFilteredProducts(products);
    }
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(inputText.toLowerCase())
    );
    setFilteredProducts(filteredProducts);
  };

  const handlePrev = () => {
    setCurrentPage((prev) => prev - 1);
  };
  const handleNext = () => {
    setCurrentPage((prev) => prev + 1);
  };

  return (
    <div>
      <div className="search-container">
        <input
          placeholder="Enter product"
          onChange={handleInputChange}
          value={inputText}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <div className="pagination-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })
        ) : (
          <h1>Loading...</h1>
        )}
      </div>
      <div className="pages">
        {currentPage > 0 && <span onClick={handlePrev}>Prev</span>}

        {[...Array(noOfPages).keys()].map((pageNo) => (
          <span
            className={`each-page-no ${
              currentPage === pageNo ? "each-page-no-active" : " "
            }`}
            key={pageNo}
            onClick={() => setCurrentPage(pageNo)}
          >
            {pageNo + 1}
          </span>
        ))}
        {currentPage < noOfPages - 1 && <span onClick={handleNext}>Next</span>}
      </div>
    </div>
  );
};

export default Pagination;
