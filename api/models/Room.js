// api/models/Room.js
import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true }, // Should be a Number
    maxPeople: { type: Number, required: true }, // Should be a Number
    desc: { type: String, required: true },
    roomNumbers: [ // This is an array of objects
      {
        number: Number, // The room number itself
        unavailableDates: { type: [Date] }, // Array of dates this room is unavailable
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Room", RoomSchema);