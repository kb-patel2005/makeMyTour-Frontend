import { doesNotMatch } from 'assert';
import axios from 'axios';

// const BACKEND_URL = "https://makemytour-5axz.onrender.com";
const BACKEND_URL = "http://localhost:8080";

//done
export const hotelsByPlace = async (place) => {
  const token = localStorage.getItem("Authorization");
  try {
    const res = await axios.get(`${BACKEND_URL}/public/hotel/${place}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

//done
export const getBookings = async (userId) => {
  const user = localStorage.getItem("Authorization");
  try {
    const res = await axios.get(`${BACKEND_URL}/booking/get`, {
      headers: {
        Authorization: `Bearer ${user}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    throw error;
  }
}

//done
export const cancelBooking = async (bookingId, cancellationReason) => {
  const token = localStorage.getItem("Authorization")
  try {
    const res = await axios.post(`${BACKEND_URL}/booking/cancel`, {
      bookingId,
      cancellationReason,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateRefundStatus = async (bookingId, status) => {
  try {
    const res = await axios.put(`${BACKEND_URL}/booking/refund/${bookingId}?status=${status}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const res = await axios.post(
      `${BACKEND_URL}/auth/login`,
      null,
      {
        params: {
          email,
          password
        }
      }
    );
    const data = res.data;
    localStorage.setItem("Authorization", data);
    const user = getuserbytoken(data);
    return user;
  } catch (error) {
    throw error;
  }
};

//done
export const signup = async ({ firstName, lastName, phoneNumber, password, email }) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/auth/signup`, {
      firstName, lastName, email, phoneNumber, password
    });
    const data = res.data;
    localStorage.setItem("Authorization", data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//done
export const getuserbytoken = async () => {
  const token = localStorage.getItem("Authorization");
  try {
    const res = await axios.get(`${BACKEND_URL}/user/getUser`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    console.log(`user ${data}`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const fetchHotelReviews = async (hotelId) => {
  try {
    console.log(hotelId)
    const res = await axios.post(`${BACKEND_URL}/api/get/hotels/${hotelId}/reviews`);

    const data = res.data;
    return data;
  } catch (e) {
    console.log(e);
  }
}

export const fetchflightReviews = async (flightId) => {
  try {
    const url = `${BACKEND_URL}/api/get/flight/${flightId}/reviews?orderBy=DESC`
    const res = await axios.get(url)
    const data = res.data;
    return data;
  } catch (e) {
    console.log(e);
  }
}

//done
export const editprofile = async (
  id,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  const token = localStorage.getItem("Authorization")
  try {
    const res = await axios.post(`${BACKEND_URL}/user/edit?id=${id}`, {
      firstName,
      lastName,
      email,
      phoneNumber,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) { }
};

//done
export const getflight = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/public/flights`);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(data);
  }
};

//done
export const getflightbysearch = async (from, to) => {
  const authorization = localStorage.getItem("Authorization");
  try {
    const res = await axios.get(
      `${BACKEND_URL}/public/flights/search?from=${from}&to=${to}`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`
        }
      }
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.log(data);
  }
};

//done
export const getflightbyid = async (id) => {
  const authorization = localStorage.getItem("Authorization");
  try {
    const res = await axios.get(`${BACKEND_URL}/public/flights/id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`
        }
      }
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

//done
export const updateFlights = async (data) => {
  const token = localStorage.getItem("Authorization");
  try {
    const res = await axios.put(`${BACKEND_URL}/booking/updateflight`, data, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data1 = res.data;
    alert("booked successfully")
    return data1;
  } catch (error) {
    alert("error during update seat");
    throw error;
  }

}

//done
export const updateFlight = async (flight) => {
  const token = localStorage.getItem("Authorization");
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/flight/${flight.id}`, flight, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

//done
export const addflight = async (
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats,
  totalReviews,
  status,
  delayReason,
  priceHistory
) => {
  const token = localStorage.getItem("Authorization")
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/flight`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      totalReviews,
      status,
      delayReason,
      price: parseInt(price),
      availableSeats: parseInt(availableSeats),
      priceHistory
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

//done
export const editflight = async (
  id,
  flightName,
  from,
  to,
  departureTime,
  arrivalTime,
  price,
  availableSeats,
  totalReviews,
  status,
  delayReason,
  priceHistory
) => {
  const token = localStorage.getItem("Authorization");
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/flight/${id}`, {
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
      totalReviews,
      status,
      delayReason,
      priceHistory
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    console.log(data)
    return data;
  } catch (error) {
    console.log(error);
  }
};

//done
export const gethotel = async () => {
  try {
    const res = await axios.get(`${BACKEND_URL}/public/hotels`);
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

// done
export const gethotelbyid = async (id) => {
  const authorization = localStorage.getItem("Authorization");
  try {
    const res = await axios.get(`${BACKEND_URL}/public/hotel/id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authorization}`
        }
      }
    );
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

//done
export const addhotel = async (data1) => {
  const token = localStorage.getItem("Authorization")
  try {
    const res = await axios.post(`${BACKEND_URL}/admin/hotel`, data1, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

//done
export const edithotel = async (
  id,
  hotelName,
  location,
  pricePerNight,
  availableRooms,
  amenities
) => {
  const token = localStorage.getItem("Authorization")
  try {
    const res = await axios.put(`${BACKEND_URL}/admin/hotel/${id}`, {
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

//done
export const handleflightbooking = async (booking) => {
  const authorization = localStorage.getItem("Authorization");
  try {
    const url = `${BACKEND_URL}/booking/flight`;
    const res = await axios.post(url, booking, {
      headers: {
        Authorization: `Bearer ${authorization}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

//done
export const handlehotelbooking = async (booking) => {
  const authorization = localStorage.getItem("Authorization");
  try {
    const url = `${BACKEND_URL}/booking/hotel`;
    const res = await axios.post(url, booking, {
      headers: {
        Authorization: `Bearer ${authorization}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
};

//done
export const cancelbooking = async (bookingId, reason) => {
  const authorization = localStorage.getItem("Authorization");
  try {
    const url = `${BACKEND_URL}/booking/${bookingId}?reason=${reason}`;
    const res = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${authorization}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

export const updateReview = async (replies, id) => {
  const token = localStorage.getItem("Authorization");
  try {
    const res = await axios.put(`${BACKEND_URL}/reply/addreply/${id}`, replies, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

//done
export const fetchFlightHistory = async (flightId) => {
  try {
    const res = await axios.post(`${BACKEND_URL}/public/flight/flighthistory/${flightId}`);
    const history = res.data;
    return history;
  } catch (error) {
    console.log(error)
  }

}

//done
export const hotelBooking = async (booking) => {
  const token = localStorage.getItem("Authorization");
  try {
    const res = await axios.post(`${BACKEND_URL}/hotel/book`, booking, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    console.log(data)
    return data;
  } catch (error) {
    console.log(error);
  }
}

//done
export const updateHotelrooms = async (id, hotel, roomType, rooms) => {
  const token = localStorage.getItem("Authorization")
  try {
    const res = await axios.put(`${BACKEND_URL}/hotel/${id}?type=${roomType}&roomIndex=${rooms.join(',')}`, hotel, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    alert("error during update room");
    console.log(error);
  }
}

//done
export const getHotelsByPlace = async (place) => {
  const authorization = localStorage.getItem("Authorization");
  try {
    const res = await axios.get(`${BACKEND_URL}/public/hotel/${place}`, {
      headers: {
        Authorization: `Bearer ${authorization}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

//done
export const recommandFlights = async () => {
  const token = localStorage.getItem("Authorization");
  try {
    const res = await axios.get(`${BACKEND_URL}/recommend/flights`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}

//done
export const recommandHotels = async () => {
  const token = localStorage.getItem("Authorization")
  try {
    const res = await axios.get(`${BACKEND_URL}/recommend/hotels`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = res.data;
    return data;
  } catch (error) {
    console.log(error);
  }
}