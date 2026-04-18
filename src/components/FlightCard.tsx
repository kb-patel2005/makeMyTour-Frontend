import { Badge } from "./ui/badge";

type Flight = {
  flightId: String,
  flightName: string;
  from: string;
  to: string;
  status: string;
  seats: string[];
  seatType: string;
  delayReason: string;
  departureTime: string;
  arrivalTime: string;
  totalPrice: number;
};

export default function FlightCard({ flight }: { flight: Flight }) {

  const getStatusBadge = (status: string) => {
    if (status === "ON_TIME") {
      return <Badge className="bg-green-500 text-white">ON TIME</Badge>;
    } else if (status === "DELAYED") {
      return <Badge className="bg-red-500 text-white">DELAYED</Badge>;
    } else if (status === "BOARDING") {
      return <Badge className="bg-yellow-500 text-black">BOARDING</Badge>;
    } else {
      return <Badge>UNKNOWN</Badge>;
    }
  };
  console.log(flight)

  return (
    <div className="bg-white shadow-lg rounded-2xl sm:w-[500px] w-[350px] p-5 mb-4 border hover:shadow-xl transition">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">{flight.flightName}</h2>
        {getStatusBadge(flight.status)}
      </div>

      <div className="flex justify-between items-center text-sm mb-3">
        <div>
          <p className="font-medium">{flight.from}</p>
          <p className="text-gray-500">{flight.departureTime}</p>
        </div>

        <div className="text-center text-3xl text-gray-400">✈️</div>

        <div>
          <p className="font-medium">{flight.to}</p>
          <p className="text-gray-500">{flight.arrivalTime}</p>
        </div>
      </div>

      {flight.status === "DELAYED" && (
        <p className="text-red-500 text-sm mb-2">
          Reason: {flight.delayReason}
        </p>
      )}
      <div className="flex justify-between items-center">
        <p className="text-red-500 text-sm mb-2">
          seat Type: {flight.seatType}
        </p>
        <p className=" text-sm mb-2">
          <div className="flex gap-2 items-center">
          seats:   {flight.seats.map((e) =>(
            <div className="p-2 rounded-full shadow-md">{e}</div>)
          )}
          </div>
        </p>
      </div>
      <p>
        Total price: {flight.totalPrice}
      </p>
      {/* <div className="flex justify-between items-center mt-3">
        <p className="text-lg font-bold">₹{flight.price}</p>
        <p className="text-sm text-gray-500">
          Seats left: {flight.availableSeats}
        </p>
      </div> */}

    </div>
  );
}