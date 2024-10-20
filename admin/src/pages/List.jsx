import { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import axios from "axios";
import { toast } from "react-toastify";

// Admin panel product list section
const List = ({ token }) => {
  const [list, setList] = useState([]); // List of products
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch the list of products from the backend
  const fetchList = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`);
      console.log(response.data);
      if (response.data.success && Array.isArray(response.data.product)) {
        setList(response.data.product);
        setLoading(false); // Add this line to stop the loading state
      } else {
        toast.error(response.data.message || "Unexpected response format");
        setLoading(false); // Handle loading state when there's an error
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      setLoading(false); // Stop the loading in case of error
    }
  };

  // Function to remove a product by ID with confirmation
  const removeProduct = async (id) => {
    if (window.confirm("Are you sure you want to remove this product?")) {
      try {
        const response = await axios.post(
          backendUrl + "/api/product/remove",
          { id },
          { headers: { token } }
        );

        if (response.data.success) {
          toast.success(response.data.message);
          await fetchList();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  // Fetch the product list when the component mounts
  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-4 text-xl font-semibold">All Products</p>
      {loading ? (
        // Show a loading message or spinner while fetching data
        <div className="flex justify-center items-center">
          <p>Loading products...</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border bg-gray-100 text-sm font-semibold">
            <p>Image</p>
            <p>Name</p>
            <p>Category</p>
            <p>Price</p>
            <p className="text-center">Action</p>
          </div>

          {/* Display the list of products */}
          {Array.isArray(list) && list.length > 0 ? (
            list.map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border-b bg-white hover:bg-gray-50 transition-colors"
              >
                {/* Product Image */}
                <img
                  src={item.image?.[0] || "/default-image.jpg"}
                  alt={item.name}
                  className="h-12 w-12 object-cover rounded-md border"
                />

                {/* Product Name */}
                <p className="truncate">{item.name}</p>

                {/* Product Category */}
                <p>{item.category}</p>

                {/* Product Price */}
                <p>
                  {currency}
                  {item.price}
                </p>

                {/* Delete Action */}
                <p
                  onClick={() => removeProduct(item._id)}
                  className="text-right md:text-center cursor-pointer text-red-500 hover:text-red-600 font-bold"
                  title="Remove Product"
                >
                  X
                </p>
              </div>
            ))
          ) : (
            // Message to show when no products are available
            <p className="text-center text-gray-500 mt-4">
              No products available
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default List;
