"use client";

import React, { useEffect, useState } from "react";
import SignupDialog from "./SignupDialog";
import { Bell, LogOut, Plane, User, Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { clearUser, setUser } from "@/store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Notification from "./Notification";
import { getuserbytoken } from "@/api";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  const logout = () => {
    dispatch(clearUser());
    setOpenMenu(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("Authorization");

    const fetchuser = async () => {
      try {
        const user1 = await getuserbytoken();
        dispatch(setUser(user1));
      } catch (e) {
        console.error(e);
      }
    };

    if (token) fetchuser();
  }, [dispatch]);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">

      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center h-16">

        <div className="flex items-center space-x-2">
          <Plane className="w-7 h-7 text-red-500" />
          <span className="text-xl md:text-2xl font-bold">MakeMyTour</span>
        </div>

        <div className="flex-1" />

        {user && (
          <div className="hidden md:flex items-center gap-8">

            <Notification trigger={<Bell className="w-5 h-5 cursor-pointer" />} />

            <Link href="/dashboard">Dashboard</Link>

            {user.role === "ADMIN" && (
              <Button size="sm" onClick={() => router.push("/admin")}>
                ADMIN
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user.firstName}</DropdownMenuLabel>
                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => router.push("/profile")}>
                  <User className="mr-2 h-4 w-4" /> Profile
                </DropdownMenuItem>

                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <div className="flex items-center gap-3 md:hidden">
          {!user && (
            <SignupDialog
              trigger={<Button className="bg-blue-600 text-white">Sign Up</Button>}
            />
          )}

          <button onClick={() => setOpenMenu(true)}>
            <Menu />
          </button>
        </div>
      </div>

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${openMenu ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <span className="font-bold">Menu</span>
          <X onClick={() => setOpenMenu(false)} className="cursor-pointer" />
        </div>

        <div className="flex flex-col gap-4 p-4">

          {user ? (
            <>
              <div className="flex items-center gap-3 border-b pb-3">
                <Avatar>
                  <AvatarFallback>
                    {user?.firstName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{user.firstName}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              <Notification
                trigger={
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Bell className="w-5 h-5" />
                    Notifications
                  </div>
                }
              />

              <Link href="/dashboard" onClick={() => setOpenMenu(false)}>
                Dashboard
              </Link>

              {user.role === "ADMIN" && (
                <Button
                  onClick={() => {
                    router.push("/admin");
                    setOpenMenu(false);
                  }}
                >
                  ADMIN
                </Button>
              )}

              <Button variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <SignupDialog
              trigger={<Button className="w-full">Sign Up</Button>}
            />
          )}
        </div>
      </div>

      {openMenu && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpenMenu(false)}
        />
      )}
    </header>
  );
};

export default Navbar;