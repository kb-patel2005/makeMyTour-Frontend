import {
  configureStore,
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";

const BACKEND_URL = "https://makemytour-5axz.onrender.com";

type Message = {
  message: string;
  updatedDate: string;
  dateTime: string;
};

type NotificationPayload = {
  entityId: string;
  messages: Message;
};

type NotificationState = {
  notifications: Message[];
  loading: boolean;
};

type UserState = {
  user: any | null;
};

type FlightState = {
  flight: any[];
  quantity: number;
  seatType: string | null;
  seatMatrix: boolean[][] | null;
};

export const postNotification = createAsyncThunk<any,NotificationPayload>("notifications/postNotification", async (payload, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("Authorization");

    const response = await fetch(`${BACKEND_URL}/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return rejectWithValue(await response.text());
    }

    return await response.json();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const addNotificationAsync = createAsyncThunk<
  any[],
  void
>("notifications/addNotificationAsync", async (_, { rejectWithValue }) => {
  try {
    const token = localStorage.getItem("Authorization");

    const res = await fetch(
      `${BACKEND_URL}/booking/getIdList`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const ids = await res.json(); 

    const results = await Promise.all(
      ids.map((id: string) => getNotificationById(id))
    );

    return results.filter(Boolean);
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const getNotificationById = async (id: string) => {
  try {
    const token = localStorage.getItem("Authorization");

    const res = await fetch(`${BACKEND_URL}/notifications/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

export const fetchNotifications = createAsyncThunk<any[], string[]>(
  "notifications/fetchNotifications",
  async (ids) => {
    const results = await Promise.all(
      ids.map((id) => getNotificationById(id))
    );

    return results;
  }
);

const hotelslice = createSlice({
  name: "hotels",
  initialState: { hotels: null as any, selectedRoom: null as any },
  reducers: {
    setHotels: (state, action: PayloadAction<any>) => {
      state.hotels = action.payload;
    },
    setRoom: (state, action: PayloadAction<any>) => {
      state.selectedRoom = action.payload;
    },
    updateHotel: (state, action: PayloadAction<any>) => {
      const newHotel = action.payload;
      if (!newHotel) return;

      if (Array.isArray(state.hotels)) {
        state.hotels = state.hotels.map((h: any) =>
          h._id === newHotel._id ? newHotel : h
        );
      }
    },
  },
});

const flightSlice = createSlice({
  name: "flights",
  initialState: {
    flight: [] as any[],
    quantity: 0,
    seatType: null,
    seatMatrix: null,
  } as FlightState,

  reducers: {
    setFlight: (state, action: PayloadAction<any[]>) => {
      state.flight = action.payload;
    },
    setSeatType: (state, action: PayloadAction<string>) => {
      state.seatType = action.payload;
    },
    setQty: (state, action: PayloadAction<number>) => {
      state.quantity = action.payload;
    },
    setSeatmatrix: (state, action: PayloadAction<boolean[][]>) => {
      state.seatMatrix = action.payload.map((row) => [...row]);
    },
    updateFlight: (state, action: PayloadAction<any>) => {
      const newFlight = action.payload;

      const index = state.flight.findIndex((f) => f.id === newFlight.id);
      if (index === -1) return;

      state.flight[index] = {
        ...state.flight[index],
        ...newFlight,
      };
    },
  },
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    loading: false,
  } as NotificationState,

  reducers: {
    liveNotification: (state, action: PayloadAction<Message>) => {
      state.notifications.unshift(action.payload);
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(postNotification.fulfilled, (state, action) => {
        state.notifications.unshift(action.payload);
      })
      .addCase(addNotificationAsync.fulfilled, (state, action) => {
        action.payload.forEach((res: any) => {
          if (res?.messages) {
            state.notifications.unshift(res.messages);
          }
        });
      });
  },
});

const userSlice = createSlice({
  name: "user",
  initialState: { user: null } as UserState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      localStorage.removeItem("Authorization");
    },
  },
});

const store = configureStore({
  reducer: {
    hotels: hotelslice.reducer,
    user: userSlice.reducer,
    flights: flightSlice.reducer,
    notification: notificationSlice.reducer,
  },
});

export const { setUser, clearUser } = userSlice.actions;
export const { setHotels, setRoom, updateHotel } = hotelslice.actions;
export const { setFlight, setQty, updateFlight, setSeatType, setSeatmatrix } =
  flightSlice.actions;
export const { liveNotification } = notificationSlice.actions;

export default store;


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;