import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

const FoodDisplay = ({ category }) => {
  const { food_list, searchQuery } = useContext(StoreContext);
  
  const filteredList = food_list.filter(item => 
    (category === "All" || category === item.category) &&
    (!searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="food-display" id="food-display">
      <h2>Top dishes near you</h2>
      <div className="food-display-list">
        {filteredList.length > 0 ? (
          filteredList.map((item, index) => (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          ))
        ) : (
          <p className="no-results">No dishes found matching "{searchQuery}"</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
