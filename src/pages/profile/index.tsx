import React, { useEffect, useState } from "react";
import {
  Edit2,
  Plane,
  Building2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { clearUser, setUser } from "@/store";
import { cancelBooking, editprofile, getBookings } from "@/api";
import { Button } from "@/components/ui/button";
import FeedbackForm from "@/components/FeedbackForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const Index = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();

  const [booking, setBooking] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("flightBooking");
  const [userData, setUserData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
  });

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        if (!user?.id) return;
        const res = await getBookings(user?.id);
        console.log("API RESPONSE:", res);
        setBooking(res?.data || res || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };

    fetchBookings();
  }, [user?.id]);

  const logout = () => {
    dispatch(clearUser());
    router.push("/");
  };

  const handleSave = async () => {
    try {
      const data = await editprofile(
        user?.id,
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.phoneNumber
      );
      dispatch(setUser(data));
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleEditFormChange = (field: string, value: string) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const [open, setOpen] = React.useState(false);
  const [reason, setReason] = useState("");

  const flightOptions = [
    "none",
    "Emergency",
    "Change of plans",
    "Health issues",
    "personal"
  ];

  const hotelOptions = [
    "none",
    "Emergency",
    "Change of plans",
    "Health issues",
    "Food compliance",
    "personal"
  ];

  const cancelbook = async (bookingId: any, reason: string) => {
    try {
      await cancelBooking(bookingId, reason);
    } catch (error) {
      console.error("Error cancelling booking:", error);
      alert("Unable to cancel booking. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Profile</h2>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)}>
                    <Edit2 />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <input value={userData.firstName} className="border border-2 p-1 rounded-md" onChange={(e) => handleEditFormChange("firstName", e.target.value)} />
                  <input value={userData.lastName} className="border border-2 p-1 rounded-md" onChange={(e) => handleEditFormChange("lastName", e.target.value)} />
                  <input value={userData.email} className="border border-2 p-1 rounded-md" onChange={(e) => handleEditFormChange("email", e.target.value)} />
                  <input value={userData.phoneNumber} className="border border-2 p-1 rounded-md" onChange={(e) => handleEditFormChange("phoneNumber", e.target.value)} />
                  <br />
                  <button className="text-lg align-middle bg-green-500 text-white px-5 py-1 rounded-md m-2" onClick={handleSave}>Save</button>
                  <button className="text-lg align-middle bg-red-400 text-white px-5 py-1 rounded-md m-2" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p className="font-normal text-xl mt-5">{user?.firstName} {user?.lastName}</p>
                  <p className="font-normal text-xl mt-5">{user?.email}</p>
                  <p className="font-normal text-xl mt-5">{user?.phoneNumber}</p>
                  <button className="text-lg align-middle bg-red-400 text-white px-5 py-1 rounded-md mt-5" onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Bookings</h2>

              {booking?.length === 0 && (
                <p className="text-gray-500">No bookings found</p>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3  text-black">
                  <TabsTrigger value="flightBooking">FlightBooking</TabsTrigger>
                  <TabsTrigger value="hotelBooking">HotelBooking</TabsTrigger>
                  <TabsTrigger value="cancelBooking">Cancelled Booking</TabsTrigger>
                </TabsList>
                <TabsContent value="flightBooking" >
                  {booking
                    ?.filter((b: any) => b.status !== "CANCELLED" && b.type === "flight")
                    .map((b: any, index: number) => (
                      <div key={index} className="border p-4 mb-4 rounded-lg">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            {b.type === "FLIGHT" ? (
                              <Plane />
                            ) : (
                              <Building2 />
                            )}
                            <div>
                              <h3>{b.type}</h3>
                              <p>ID: {b.id}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">

                            <FeedbackForm bookingId={b.bookingId} type={b.type} userId={user?.id} />
                            <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                              <DialogTrigger asChild>
                                <Button className="bg-blue-600 text-white px-4 py-2 rounded">
                                  Cancel
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px] bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-bold">
                                    Booking Cancellation form
                                  </DialogTitle>
                                  <DialogDescription>
                                    Please provide the reason for cancellation.
                                  </DialogDescription>
                                </DialogHeader>
                                <form className="flex flex-col gap-4" onSubmit={async (e) => {
                                  e.preventDefault();
                                  await cancelbook(b.id, reason);
                                  setBooking(prev =>
                                    prev.map(item =>
                                      item.id === b.id
                                        ? { ...item, status: "CANCELLED" , refundStatus : "PENDING", refundDate: Date.now() + 24 * 60 * 60 * 1000}
                                        : item
                                    )
                                  );
                                  setOpen(false);
                                }}>
                                  <h1>{b.type} Cancellation</h1>
                                  <p>booking ID: {b.bookingId}</p>
                                  <p>booking Type: {b.type}</p>
                                  <p>you booked: {b.qty}</p>
                                  <label className="flex flex-col gap-1">
                                    Reason for cancellation:
                                    <select
                                      className="border p-2 rounded"
                                      value={reason}
                                      onChange={(e) => setReason(e.target.value)}
                                      required
                                    >
                                      {b.type == "flight" ? flightOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      )) : hotelOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>

                                  </label>
                                  <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded" >
                                    Submit Cancellation
                                  </button>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <div className="flex justify-between mt-4">
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>{formatDate(b.bookingDate)}</span>
                            <span>{b.type}</span>
                            <span>{b.status || "Confirmed"}</span>
                          </div>
                          <p>₹ {b.totalPrice}</p>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                          <p>Refund status: {b.refundStatus || "n/a"}</p>
                          <p>Refund amount: ₹ {b.refundAmount ? b.refundAmount.toFixed(2) : "0.00"}</p>
                          {b.cancellationReason && <p>Cancel reason: {b.cancellationReason}</p>}
                        </div>
                      </div>
                    ))}
                </TabsContent>
                <TabsContent value="hotelBooking" >
                  {booking
                    ?.filter((b: any) => b.status !== "CANCELLED" && b.type == "hotel")
                    .map((b: any, index: number) => (
                      <div key={index} className="border p-4 mb-4 rounded-lg">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            {b.type === "FLIGHT" ? (
                              <Plane />
                            ) : (
                              <Building2 />
                            )}
                            <div>
                              <h3>{b.type}</h3>
                              <p>ID: {b.id}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">

                            <FeedbackForm bookingId={b.bookingId} type={b.type} userId={user?.id} />
                            <Dialog open={open} onOpenChange={() => setOpen(!open)}>
                              <DialogTrigger asChild>
                                <Button className="bg-blue-600 text-white px-4 py-2 rounded">
                                  Cancel
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px] bg-white">
                                <DialogHeader>
                                  <DialogTitle className="text-2xl font-bold">
                                    Booking Cancellation form
                                  </DialogTitle>
                                  <DialogDescription>
                                    Please provide the reason for cancellation.
                                  </DialogDescription>
                                </DialogHeader>
                                <form className="flex flex-col gap-4" onSubmit={async (e) => {
                                  e.preventDefault();
                                  await cancelbook(b.id, reason);
                                  setBooking(prev =>
                                    prev.map(item =>
                                      item.id === b.id
                                        ? { ...item, status: "CANCELLED" , refundStatus : "PENDING", refundDate: Date.now() + 24 * 60 * 60 * 1000}
                                        : item
                                    )
                                  );
                                  setOpen(false);
                                }}>
                                  <h1>{b.type} Cancellation</h1>
                                  <p>booking ID: {b.bookingId}</p>
                                  <p>booking Type: {b.type}</p>
                                  <p>you booked: {b.qty}</p>
                                  <label className="flex flex-col gap-1">
                                    Reason for cancellation:
                                    <select
                                      className="border p-2 rounded"
                                      value={reason}
                                      onChange={(e) => setReason(e.target.value)}
                                      required
                                    >
                                      {b.type == "flight" ? flightOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      )) : hotelOptions.map((opt) => (
                                        <option key={opt} value={opt}>
                                          {opt}
                                        </option>
                                      ))}
                                    </select>

                                  </label>
                                  <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded" >
                                    Submit Cancellation
                                  </button>
                                </form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>

                        <div className="flex justify-between mt-4">
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>{formatDate(b.bookingDate)}</span>
                            <span>{b.type}</span>
                            <span>{b.status || "Confirmed"}</span>
                          </div>

                          <p>₹ {b.totalPrice}</p>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                          <p>Refund status: {b.refundStatus || "n/a"}</p>
                          <p>Refund amount: ₹ {b.refundAmount ? b.refundAmount.toFixed(2) : "0.00"}</p>
                          {b.cancellationReason && <p>Cancel reason: {b.cancellationReason}</p>}
                        </div>
                      </div>
                    ))}
                </TabsContent>
                <TabsContent value="cancelBooking">

                  {booking
                    ?.filter((b: any) => b.status == "CANCELLED")
                    .map((b: any, index: number) => (
                      <div key={index} className="border p-4 mb-4 rounded-lg">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            {b.type === "FLIGHT" ? (
                              <Plane />
                            ) : (
                              <Building2 />
                            )}
                            <div>
                              <h3>{b.type}</h3>
                              <p>ID: {b.id}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between mt-4">
                          <div className="flex gap-4 text-sm text-gray-600">
                            <span>{formatDate(b.bookingDate)}</span>
                            <span>{b.type}</span>
                            <span>{b.status}</span>
                          </div>

                          <p>₹ {b.totalPrice}</p>
                        </div>

                        <div className="mt-2 text-sm text-gray-600">
                          <p>Refund status: {b.refundStatus || "n/a"}</p>
                          <p>Refund amount: ₹ {b.refundAmount ? b.refundAmount.toFixed(2) : "0.00"}</p>
                          {b.cancellationReason && <p>Cancel reason: {b.cancellationReason}</p>}
                        </div>
                      </div>
                    ))}
                </TabsContent>
              </Tabs>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;