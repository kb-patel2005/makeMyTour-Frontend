"use client";

import { useRouter } from "next/router";
import {
  Plane,
  Luggage,
  Clock,
  Calendar,
  MapPin,
  Gift,
  AlertCircle,
  Star,
  Info,
  ArrowRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchflightReviews,
  getflightbyid,
  getHotelsByPlace,
} from "@/api";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignupDialog from "@/components/SignupDialog";
import Loader from "@/components/Loader";
import { setFlight, setQty, setSeatType, setUser } from "@/store";
import Chart from "@/components/Chart";
import Reccomendation from "@/components/Reccomendation";
import Reviews from "@/components/Reviews";

interface Flight {
  id: string;
  flightName: string;
  from: string;
  to: string;
  departureTime: string;
  arrivalTime: string;
  price: number;
  availableSeats: number;
  bussinesseats: boolean[][];
  economicseats: boolean[][];
  priceHistory?: { price: number; timestamp: string }[];
}

const BookFlightPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [flight, setFlights] = useState<Flight | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [fetchedHotel, setFetchedHotel] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [booktype, setBooktype] = useState<"economics" | "business">("economics");
  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const filtered = await getflightbyid(id);
        setFlights(filtered);
        const reviews = await fetchflightReviews(id);
        setReviews(reviews);
        const hotel = await getHotelsByPlace(filtered.to);
        setFetchedHotel(hotel);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFlights();
  }, [id]);

  if (loading) return <Loader />;
  if (!flight) return <div>No flight found</div>;
  const basePrice = flight?.price * quantity;

  const totalPrice =
    booktype.charAt(0) == "e" || "E"
      ? basePrice
      : basePrice + basePrice * 0.33;

  const taxes = 374 * quantity;
  const other = 249 * quantity;
  const discount = 250 * quantity;

  const grandTotal = totalPrice + taxes + other - discount;

  const flightDetails = {
    from: "Bengaluru",
    to: "New Delhi",
    date: "Thursday, Jan 16",
    flightNo: "IX 2747",
    aircraft: "Airbus A320",
    airline: "Air India Express",
    departureTime: "17:55",
    arrivalTime: "20:55",
    duration: "3h 0m",
    departureTerminal: "Bengaluru International Airport, Terminal T2",
    arrivalTerminal: "Indira Gandhi International Airport, Terminal T3",
    cabinBaggage: "7 Kgs / Adult",
    checkInBaggage: "15 Kgs (1 piece only) / Adult",
  };

  const hotels = [
    {
      name: "Hotel Park Tree",
      rating: 4,
      price: 9000,
      image:
        "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800",
      location: "Near Airport, New Delhi",
    },
    {
      name: "Lemon Tree Premier",
      rating: 4,
      price: 43875,
      image:
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800",
      location: "Connaught Place, New Delhi",
    },
    {
      name: "Hotel Kian",
      rating: 4,
      price: 1968,
      image:
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800",
      location: "Karol Bagh, New Delhi",
    },
  ];


  const promoOffers = [
    {
      code: "MMTSECURE",
      description:
        "Get an instant discount of ₹299 on your flight booking and Trip Secure with this coupon!",
      amount: 299,
    },
    {
      code: "SPECIALUPI",
      description:
        "Use this code and get ₹362 instant discount on payments via UPI only!",
      amount: 362,
    },
    {
      code: "WELCOME100",
      description:
        "Flat ₹100 off for first-time users on flight bookings.",
      amount: 100,
    },
    {
      code: "FESTIVE500",
      description:
        "Enjoy ₹500 discount during festive season bookings.",
      amount: 500,
    },
  ];
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleBooking = async () => {
    try {
      dispatch(setFlight([flight]));
      dispatch(setQty(quantity));
      dispatch(setSeatType(booktype));
      dispatch(setUser({ ...user }));
      setOpen(false);
      router.push("/Seat")
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
              <div>
                <div className="flex items-center flex-wrap gap-4 mb-2">
                  <h2 className="text-lg font-bold flex items-center">
                    <span>{flight.from}</span>
                    <ArrowRight className="w-5 h-5 mx-2" />
                    <span>{flight.to}</span>
                  </h2>
                  <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium">
                    CANCELLATION FEES APPLY
                  </span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{formatDate(flight.departureTime)}</span>
                  <span className="mx-2">•</span>
                  <Clock className="w-4 h-4 mr-2" />
                  <span>Non Stop - {flightDetails.duration}</span>
                </div>
              </div>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700 flex items-center">
                <Info className="w-4 h-4 mr-1" />
                View Fare Rules
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Plane className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="font-semibold">{flight.flightName}</div>
                <div className="text-sm text-gray-600">
                  {flightDetails.flightNo} • {flightDetails.aircraft}
                </div>
              </div>
              <div className="ml-auto text-sm">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                  Economy
                </span>
                <span className="ml-2 text-gray-600">MMTSPECIAL</span>
              </div>
            </div>

            <div className="flex flex-wrap md:flex-nowrap justify-between items-start gap-6 border-t pt-6">
              <div>
                <div className="text-2xl font-bold">
                  {formatDate(flight.departureTime)}
                </div>
                <div className="text-sm text-gray-600 mt-1 flex items-start">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                  {flight.from} International Airport, Terminal T2
                </div>
              </div>
              <div className="text-center flex-shrink-0">
                <div className="text-sm text-gray-600 mb-1">
                  {flightDetails.duration}
                </div>
                <div className="w-32 h-0.5 bg-gray-300 relative my-2">
                  <div className="absolute -top-2 right-0 w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center">
                    <Plane className="w-3 h-3 text-gray-600" />
                  </div>
                </div>
                <div className="text-xs text-gray-500">Non-stop</div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {formatDate(flight.arrivalTime)}
                </div>
                <div className="text-sm text-gray-600 mt-1 flex items-start justify-end">
                  <MapPin className="w-4 h-4 mr-1 flex-shrink-0 mt-0.5" />
                  {flight.to} International Airport, Terminal T3
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-6 text-sm text-gray-600">
              <div className="flex items-center">
                <Luggage className="w-5 h-5 mr-2 text-gray-500" />
                <span>Cabin Baggage: {flightDetails.cabinBaggage}</span>
              </div>
              <div className="flex items-center">
                <Luggage className="w-5 h-5 mr-2 text-gray-500" />
                <span>Check-in Baggage: {flightDetails.checkInBaggage}</span>
              </div>
            </div>
          </div>

          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                Cancellation & Date Change Policy
              </h2>
              <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                View Policy
              </button>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Plane className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="font-semibold">BLR-DEL</span>
                </div>
                <div className="font-bold text-lg">₹ 4,300</div>
              </div>
              <div className="h-2.5 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
              <div className="flex justify-between mt-2 text-xs text-gray-600">
                <span>Now</span>
                <span>16 Jan, 15:55</span>
                <span>16 Jan, 17:55</span>
              </div>
            </div>
          </div>
          <div className="col-span-2 bg-white p-6 rounded-xl">
            <h1>Reviews</h1>

            <div className="mt-6">
              <Reviews 
              // review={reviews}
              reviewType="flight" 
              id={id as string}/>
              <Chart data={flight.priceHistory || []} />
              {fetchedHotel.length > 0 && (
                <Reccomendation hotels={fetchedHotel} />
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center">
                <Gift className="w-5 h-5 mr-2 text-red-500" />
                Book a Flight & unlock these offers
              </h2>
              <span className="bg-red-100 text-red-600 text-xs px-3 py-1 rounded-full font-medium">
                Flyer Exclusive Deal
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {hotels.map((hotel, index) => (
                <div
                  key={index}
                  className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium">
                      Best Seller
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {hotel.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-1" />
                      {hotel.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-yellow-400">
                        {[...Array(hotel.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          Starting from
                        </div>
                        <div className="font-bold text-lg">
                          ₹ {hotel.price.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl lg:sticky lg:top-10">
          <h2 className="font-bold mb-4">Fare Summary</h2>

          <select
            value={booktype}
            onChange={(e) =>
              setBooktype(e.target.value as any)
            }
            className="w-full border p-2 mb-4"
          >
            <option value="Economics">Economics</option>
            <option value="Business">Business (+33%)</option>
          </select>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Base</span>
              <span>₹ {totalPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Taxes</span>
              <span>₹ {taxes.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Other</span>
              <span>₹ {other.toLocaleString()}</span>
            </div>

            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>- ₹ {discount.toLocaleString()}</span>
            </div>

            <div className="flex justify-between font-bold border-t pt-2">
              <span>Total</span>
              <span>₹ {grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {user ? (
            <Button className="w-full mt-4 bg-red-600" onClick={handleBooking}>
              Book Now
            </Button>

          ) : (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="w-full mt-4 bg-red-600">
                  Book Now
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Login Required</DialogTitle>
                </DialogHeader>

                <SignupDialog
                  trigger={<Button>Login</Button>}
                />
              </DialogContent>
            </Dialog>
          )}

          <div className="mt-8">
            <div className="bg-[#FFF8E7] p-6 rounded-xl">
              <h3 className="font-bold mb-4 flex items-center">
                <Gift className="w-5 h-5 mr-2 text-yellow-600" />
                PROMO CODES
              </h3>
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Enter promo code here"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                />
              </div>
              {promoOffers.map((offer, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg mb-3 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      name="promo"
                      className="mt-1.5 h-4 w-4 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <div className="font-semibold text-red-600">
                        {offer.code}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {offer.description}
                      </p>
                      <button className="text-blue-600 text-sm font-medium mt-2 hover:text-blue-700">
                        Terms & Conditions
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookFlightPage;