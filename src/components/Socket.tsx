import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let client: Client | null = null;

export const connectSocket = ({
  onHotel,
  onFlight,
}: {
  onHotel?: (data: any) => void;
  onFlight?: (data: any) => void;
}) => {

  if (client && client.connected) return;

  client = new Client({
    webSocketFactory: () => new SockJS(" https://makemytour-5axz.onrender.com/ws"),
    onConnect: () => {
      console.log("✅ SOCKET CONNECTED");
      if (onHotel) {
        client?.subscribe("/topic/hotels", (msg) => {
          console.log("📡 HOTEL:", msg.body);
          onHotel(JSON.parse(msg.body));
        });
      }

      if (onFlight) {
        client?.subscribe("/topic/flights", (msg) => {
          console.log("✈️ FLIGHT:", msg.body);
          alert(msg.body)
          onFlight(JSON.parse(msg.body));
        });
      }
    },

    onStompError: (err) => {
      console.error("❌ STOMP ERROR", err);
    },
  });
  client.activate();
};

export const disconnectSocket = () => {
  client?.deactivate();
};

export const sendFlightUpdate = (flight: any) => {
  if (client && client.connected) {
    client.publish({
      destination: "/app/flight/update",
      body: JSON.stringify(flight),
    });

    console.log("📤 Sent:", flight);
  }
};

export const sendHotelUpdate = (hotel: any) => {
  if (!client || !client.connected) {
    console.warn("Socket not connected");
    return;
  }
  if (client && client.connected) {
    client.publish({
      destination: "/app/hotel/update",
      body: JSON.stringify(hotel),
    });
    console.log("📤 Sent:", hotel);
  }
};