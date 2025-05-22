import useFetch from "../../hooks/useFetch";
import "./featuredProperties.css";

const FeaturedProperties = () => {
  const { data, loading, error } = useFetch("/hotels?featured=true&limit=4");

  console.log("Fetched Data:", data); // ✅ Debug log

  return (
    <div className="fp">
      {loading ? (
        "Loading..."
      ) : error ? (
        <div className="error">Error loading featured properties.</div>
      ) : data.length === 0 ? (
        <div>No featured properties found.</div>
      ) : (
        <>
          {data.map((item) => (
            <div className="fpItem" key={item._id}>
              <img
                src={item.photos?.[0] || "https://via.placeholder.com/150"}
                alt={item.name}
                className="fpImg"
              />
              <span className="fpName">{item.name}</span>
              <span className="fpCity">{item.city}</span>
              <span className="fpPrice">Starting from ${item.cheapestPrice}</span>
              {item.rating && (
                <div className="fpRating">
                  <button>{item.rating}</button>
                  <span>Excellent</span>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default FeaturedProperties;
