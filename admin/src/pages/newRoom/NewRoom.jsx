// In admin/src/pages/newRoom/NewRoom.jsx

import "./newRoom.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import useFetch from "../../hooks/useFetch";
import axios from "axios";
import { roomInputs } from "../../formSource"; // Assuming you have this for room inputs

const NewRoom = () => {
  const [info, setInfo] = useState({});
  const [hotelId, setHotelId] = useState(undefined); // State to hold the selected hotel ID
  const [roomNumbers, setRoomNumbers] = useState(""); // State to hold comma-separated room numbers

  // Fetch hotels to populate the "Choose a hotel" dropdown
  const { data, loading, error } = useFetch("/hotels"); // Assuming this fetches hotels

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSelectHotel = (e) => {
    setHotelId(e.target.value); // Update selected hotel ID
  };

  const handleRoomNumbersChange = (e) => {
    setRoomNumbers(e.target.value); // Update the comma-separated room numbers string
  };

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      // 1. Prepare room numbers array from the comma-separated string
      const roomNumbersArray = roomNumbers.split(",").map((num) => ({ number: Number(num.trim()) }));
      // You might need to add unavailableDates property here if your schema requires it, e.g.:
      // .map((num) => ({ number: Number(num.trim()), unavailableDates: [] }));

      // 2. Prepare the final room data object with type conversions
      const finalInfo = { ...info };

      // Ensure price is a number
      if (finalInfo.price) {
        finalInfo.price = Number(finalInfo.price);
        if (isNaN(finalInfo.price)) {
          alert("Please enter a valid number for Price.");
          return;
        }
      } else { // Check if price is required but not provided
          // You should check your roomInputs if 'price' is a required field here
          alert("Price is a required field.");
          return;
      }

      // Ensure maxPeople is a number
      if (finalInfo.maxPeople) {
        finalInfo.maxPeople = Number(finalInfo.maxPeople);
        if (isNaN(finalInfo.maxPeople)) {
          alert("Please enter a valid number for Max People.");
          return;
        }
      } else { // This is the error we got! Check if maxPeople is required.
          alert("Max People is a required field."); // This alert should now trigger
          return;
      }


      const newRoom = {
        ...finalInfo,
        roomNumbers: roomNumbersArray, // Use the prepared array
        hotelId: hotelId, // Include the selected hotel ID
      };

      // console.log("Sending to backend:", newRoom); // Log payload before sending

      await axios.post(`/rooms/${hotelId}`, newRoom); // Assuming your route is /rooms/:hotelId

      alert("Room created successfully!");
      // Optionally, redirect or clear form
    } catch (err) {
      console.error("Frontend Axios Error:", err.response?.data || err.message);
      alert(`Failed to create room: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Room</h1>
        </div>
        <div className="bottom">
          <div className="right">
            <form>
              {roomInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input
                    id={input.id}
                    onChange={handleChange}
                    type={input.type}
                    placeholder={input.placeholder}
                  />
                </div>
              ))}

              {/* Input for comma-separated room numbers */}
              <div className="formInput">
                <label>Room Numbers (comma-separated)</label>
                <input
                  id="roomNumbersInput" // Use a distinct ID for this input
                  onChange={handleRoomNumbersChange}
                  type="text"
                  placeholder="e.g., 101,102,103"
                  value={roomNumbers}
                />
              </div>

              {/* Choose a Hotel dropdown */}
              <div className="formInput">
                <label>Choose a hotel</label>
                <select
                  id="hotelId"
                  onChange={handleSelectHotel}
                  value={hotelId || ""} // Control the select's value
                >
                  <option value="">Select Hotel</option> {/* Default empty option */}
                  {loading ? (
                    <option disabled>Loading hotels...</option>
                  ) : error ? (
                    <option disabled>Error loading hotels</option>
                  ) : (
                    data &&
                    data.map((hotel) => (
                      <option key={hotel._id} value={hotel._id}>
                        {hotel.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <button onClick={handleClick} disabled={!hotelId}>
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoom;