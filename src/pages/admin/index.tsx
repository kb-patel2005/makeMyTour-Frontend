"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FlightList from "@/components/Flights/Flightlist";
import {
  addflight,
  editflight,
  getuserbytoken,
} from "@/api";
import HotelList from "@/components/Hotel/Hotel";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import axios from "axios";
const mockFlights = [
  {
    _id: "1",
    flightName: "AirOne 101",
    from: "New York",
    to: "London",
    departureTime: "2023-07-01T08:00",
    arrivalTime: "2023-07-01T20:00",
    price: 500,
    availableSeats: 150,
  },
  {
    _id: "2",
    flightName: "SkyHigh 202",
    from: "Paris",
    to: "Tokyo",
    departureTime: "2023-07-02T10:00",
    arrivalTime: "2023-07-03T06:00",
    price: 800,
    availableSeats: 200,
  },
  {
    _id: "3",
    flightName: "EagleWings 303",
    from: "Los Angeles",
    to: "Sydney",
    departureTime: "2023-07-03T22:00",
    arrivalTime: "2023-07-05T06:00",
    price: 1200,
    availableSeats: 180,
  },
];
let stompClient: Client | null = null;
const mockHotels = [
  {
    _id: "1",
    hotelName: "Luxury Palace",
    location: "Paris, France",
    pricePerNight: 300,
    availableRooms: 50,
    amenities: "Wi-Fi, Pool, Spa, Restaurant",
  },
  {
    _id: "2",
    hotelName: "Seaside Resort",
    location: "Bali, Indonesia",
    pricePerNight: 200,
    availableRooms: 100,
    amenities: "Beach Access, Wi-Fi, Restaurant, Water Sports",
  },
  {
    _id: "3",
    hotelName: "Mountain Lodge",
    location: "Aspen, Colorado",
    pricePerNight: 250,
    availableRooms: 30,
    amenities: "Ski-in/Ski-out, Fireplace, Hot Tub, Restaurant",
  },
];
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  phoneNumber: string;
}
const sendFlightUpdate = (flight: any) => {
  if (stompClient && stompClient.connected) {
    stompClient.publish({
      destination: "/app/flight/update", // 🔥 IMPORTANT
      body: JSON.stringify(flight)
    });
  } else {
    console.log("WebSocket not connected ❌");
  }
};

function UserSearch() {
  const [email, setEmail] = useState("");
  const [user, setUser] = useState<User | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await getuserbytoken();
    const mockUser: User = data;
    setUser(mockUser);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="email" className="sr-only">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Search user by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <Button type="submit">Search</Button>
      </form>
      {user && (
        <div className="border p-4 rounded-md">
          <h3 className="font-bold mb-2">User Details</h3>
          <p>
            <strong>Name:</strong> {user.firstName} {user.lastName}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Phone:</strong> {user.phoneNumber}
          </p>
        </div>
      )}
    </div>
  );
}

type RoomForm = {
  type: string;
  price: string;
  totalRooms: string;
  amenities: string[];
  images: File[];
};

type HotelForm = {
  hotelName: string;
  country: string;
  state: string;
  location: string;
  description: string;
  rating: number;
  rooms: RoomForm[];
};

const AMENITIES = ["AC", "WiFi", "TV", "Breakfast", "Parking"];

function HotelForm({ id }: { id?: string }) {

  const [hotel, setHotel] = useState<HotelForm>({
    hotelName: "",
    country: "",
    state: "",
    location: "",
    description: "",
    rating: 0,
    rooms: [],
  });

  useEffect(() => {
    if (!id) return;

    axios.get(`https://makemytour-5axz.onrender.com/hotel/${id}`)
      .then((res) => {
        const data = res.data;
        setHotel({
          hotelName: data.hotelName || "",
          country: data.country || "",
          state: data.state || "",
          location: data.location || "",
          description: data.description || "",
          rating: data.rating || 0,
          rooms: (data.rooms || []).map((r: any) => ({
            type: r.type || "",
            price: r.price || "",
            totalRooms: r.totalRooms || "",
            amenities: r.amenities || []
          })),
        });
      });
  }, [id]);

  const addRoom = () => {
    setHotel((prev) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          type: "",
          price: "",
          totalRooms: "",
          amenities: [],
          images: [],
        },
      ],
    }));
  };

  const updateRoomField = (
    index: number,
    field: keyof RoomForm,
    value: any
  ) => {
    setHotel((prev) => {
      const updated = [...prev.rooms];
      (updated[index] as any)[field] = value;
      return { ...prev, rooms: updated };
    });
  };

  const toggleAmenity = (roomIndex: number, amenity: string) => {
    setHotel((prev) => {
      const updated = [...prev.rooms];
      const amenities = updated[roomIndex].amenities;

      if (amenities.includes(amenity)) {
        updated[roomIndex].amenities = amenities.filter(a => a !== amenity);
      } else {
        updated[roomIndex].amenities.push(amenity);
      }

      return { ...prev, rooms: updated };
    });
  };

  const handleUpload = (roomIndex: number, files: FileList | null) => {
    if (!files) return;

    const fileArr = Array.from(files);

    setHotel((prev) => {
      const updatedRooms = prev.rooms.map((room, i) => {
        if (i !== roomIndex) return room;

        return {
          ...room,
          images: [...room.images, ...fileArr], // ✅ immutable
        };
      });

      return { ...prev, rooms: updatedRooms };
    });
  };

  const handleSubmit = async () => {

    if (hotel.rooms.length === 0) {
      alert("Add at least one room");
      return;
    }

    const formData = new FormData();

    const payload = {
      hotelName: hotel.hotelName,
      country: hotel.country,
      state: hotel.state,
      location: hotel.location,
      description: hotel.description,
      rating: hotel.rating,
      rooms: hotel.rooms.map((r) => ({
        type: r.type,
        price: r.price,
        totalRooms: r.totalRooms,
        amenities: r.amenities,
        images: r.images
      })),
    };

    formData.append("hotel", JSON.stringify(payload));

    hotel.rooms.forEach((room, i) => {
      room.images.forEach((file) => {
        formData.append(`files_${i}`, file);
      });
    });

    const token = localStorage.getItem("Authorization");

    try {
      if (id) {
        await axios.put(`https://makemytour-5axz.onrender.com/hotel/${id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
            // "Authorization": `Bearer ${token}`
          }
        });
        alert("Hotel updated");
      } else {
        await axios.post(`https://makemytour-5axz.onrender.com/admin/hotel`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
            // "Authorization": `Bearer ${token}`
          }
        });
        alert("Hotel created");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-4">

      <input
        placeholder="Hotel Name"
        value={hotel.hotelName}
        onChange={(e) =>
          setHotel(prev => ({ ...prev, hotelName: e.target.value }))
        }
        className="border p-2 w-full"
      />
      <input
        placeholder="Country"
        value={hotel.country}
        onChange={(e) =>
          setHotel(prev => ({ ...prev, country: e.target.value }))
        }
        className="border p-2 w-full"
      />
      <input
        placeholder="State"
        value={hotel.state}
        onChange={(e) =>
          setHotel(prev => ({ ...prev, state: e.target.value }))
        }
        className="border p-2 w-full"
      />

      <input
        placeholder="Location"
        value={hotel.location}
        onChange={(e) =>
          setHotel(prev => ({ ...prev, location: e.target.value }))
        }
        className="border p-2 w-full"
      />

      <input
        placeholder="Description"
        value={hotel.description}
        onChange={(e) =>
          setHotel(prev => ({ ...prev, description: e.target.value }))
        }
        className="border p-2 w-full"
      />

      <input
        type="number"
        placeholder="Rating"
        value={hotel.rating}
        onChange={(e) =>
          setHotel(prev => ({ ...prev, rating: Number(e.target.value) }))
        }
        className="border p-2 w-full"
      />

      <h2 className="font-bold">Rooms</h2>

      {hotel.rooms.map((room, i) => (
        <div key={i} className="border p-3 space-y-2">

          <input
            placeholder="Type"
            value={room.type}
            onChange={(e) =>
              updateRoomField(i, "type", e.target.value)
            }
            className="border p-2 w-full"
          />

          <input
            placeholder="Price"
            value={room.price}
            onChange={(e) =>
              updateRoomField(i, "price", e.target.value)
            }
            className="border p-2 w-full"
          />

          <input
            placeholder="Total Rooms"
            value={room.totalRooms}
            onChange={(e) =>
              updateRoomField(i, "totalRooms", e.target.value)
            }
            className="border p-2 w-full"
          />

          <div className="flex gap-3 flex-wrap">
            {AMENITIES.map((a) => (
              <label key={a} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={room.amenities.includes(a)}
                  onChange={() => toggleAmenity(i, a)}
                />
                {a}
              </label>
            ))}
          </div>

          <input
            type="file"
            multiple
            onChange={(e) => handleUpload(i, e.target.files)}
          />

        </div>
      ))}

      <button
        onClick={addRoom}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Add Room
      </button>

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 w-full"
      >
        {id ? "Update Hotel" : "Create Hotel"}
      </button>
    </div>
  );
}

type TimePrice = {
  timestamp: string;
  price: number;
}

type Flight = {
  id?: string;
  flightName: string;
  from: string;
  to: string;
  status: string;
  delayReason: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  totalReviews: number;
  priceHistory: TimePrice[];
};

const formatDateTime = (value: string) => {
  if (!value) return "";
  return value.slice(0, 16);
};

function AddEditFlight({ flight }: { flight: Flight | null }) {

  console.log(flight)

  const defaultForm = {
    id: "",
    flightName: "",
    from: "",
    to: "",
    status: "ON_TIME",
    delayReason: "",
    departureTime: "",
    arrivalTime: "",
    price: 0,
    availableSeats: 0,
    totalReviews: 0,
    priceHistory: []
  };

  const [formData, setFormData] = useState<Flight>(defaultForm);

  useEffect(() => {
    if (flight) {
      console.log(flight)
      setFormData({
        ...flight,
        departureTime: formatDateTime(flight.departureTime),
        arrivalTime: formatDateTime(flight.arrivalTime),
      });
    } else {
      setFormData(defaultForm);
    }
  }, [flight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "departureTime") {
        const dep = new Date(value);
        dep.setHours(dep.getHours() + 2);
        return {
          ...prev,
          departureTime: value,
          arrivalTime: dep.toISOString().slice(0, 16)
        };
      }

      return {
        ...prev,
        [name]:
          name === "price" ||
            name === "availableSeats" ||
            name === "totalReviews"
            ? Number(value)
            : value
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newHistoryItem = {
      timestamp: formData.arrivalTime,
      price: formData.price,
    };

    let updatedPriceHistory: TimePrice[] = [];
    if (flight && flight.priceHistory) {
      updatedPriceHistory = [...flight.priceHistory, newHistoryItem];
    } else {
      updatedPriceHistory = [newHistoryItem];
    }
    let data1;
    if (flight) {
      await editflight(
        flight.id,
        formData.flightName,
        formData.from,
        formData.to,
        formData.departureTime,
        formData.arrivalTime,
        formData.price,
        formData.availableSeats,
        formData.totalReviews,
        formData.status,
        formData.delayReason,
        updatedPriceHistory
      );

      sendFlightUpdate({
        id: flight.id,
        status: formData.status,
        to: formData.to,
        from: formData.from,
        departureTime: formData.departureTime,
        arrivalTime: formData.arrivalTime,
      });
    } else {
      data1 = await addflight(
        formData.flightName,
        formData.from,
        formData.to,
        formData.departureTime,
        formData.arrivalTime,
        formData.price,
        formData.availableSeats,
        formData.totalReviews,
        formData.status,
        formData.delayReason,
        updatedPriceHistory
      );
    }
    setFormData(defaultForm);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">

      <h3 className="text-lg font-semibold">
        {flight ? "Edit Flight" : "Add New Flight"}
      </h3>

      <div>
        <Label>Flight Name</Label>
        <Input
          name="flightName"
          value={formData.flightName}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>From</Label>
        <Input
          name="from"
          value={formData.from}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>To</Label>
        <Input
          name="to"
          value={formData.to}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Departure Time</Label>
        <Input
          name="departureTime"
          type="datetime-local"
          value={formData.departureTime}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Arrival Time</Label>
        <Input
          name="arrivalTime"
          type="datetime-local"
          value={formData.arrivalTime}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Price</Label>
        <Input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <Label>Available Seats</Label>
        <Input
          name="availableSeats"
          type="number"
          min={0}
          value={formData.availableSeats}
          onChange={handleChange}
          required
        />
      </div>

      {flight && (
        <>
          <div>
            <Label>Delay Reason</Label>
            <Input
              name="delayReason"
              value={formData.delayReason}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Status</Label>
            <select
              className="border p-2 rounded w-full"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
            >
              <option value="ON_TIME">ON_TIME</option>
              <option value="DELAYED">DELAYED</option>
              <option value="BOARDING">BOARDING</option>
            </select>
          </div>
        </>
      )}

      <Button type="submit">
        {flight ? "Update Flight" : "Add Flight"}
      </Button>
    </form>
  );
}
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("flights");
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  useEffect(() => {
    stompClient = new Client({
      webSocketFactory: () => new SockJS(" https://makemytour-5axz.onrender.com/ws"),

      onConnect: () => {
        console.log("Connected ✅");
      }
    });

    stompClient.activate();

    return () => {
      stompClient?.deactivate();
    };
  }, []);

  return (
    <div className="container mx-auto p-4 bg-white max-w-full">
      <h1 className="text-3xl font-bold mb-6 ">Admin Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3  text-black">
          <TabsTrigger value="flights">Flights</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="flights">
          <Card>
            <CardHeader>
              <CardTitle>Manage Flights</CardTitle>
              <CardDescription>
                Add, edit, or remove flights from the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <FlightList onSelect={setSelectedFlight} />
                <AddEditFlight flight={selectedFlight} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="hotels">
          <Card>
            <CardHeader>
              <CardTitle>Manage Hotels</CardTitle>
              <CardDescription>
                Add, edit, or remove hotels from the system.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <HotelList onSelect={setSelectedHotel} />
                {/* <AddEditHotel hotel={selectedHotel} />
                 */}
                <HotelForm />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Search for users by email.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserSearch />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
