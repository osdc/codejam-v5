import React, { useEffect, useState } from 'react'
import { Button } from "../button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { toast } from "sonner";

function Header() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;  // Only parse if there's a valid string
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(user ? "User Info:" : "No user found", user);
  }, [user]);

  const login = useGoogleLogin({
    onSuccess: async (tokenInfo) => {
      setLoading(true);
      try {
        await GetUserProfile(tokenInfo);
      } catch (error) {
        console.error("Login Failed:", error);
        toast.error("Google login failed. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error("Login Failed:", error);
      toast.error("Google login failed. Please try again.");
    },
  });

  const GetUserProfile = async (tokenInfo) => {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
          },
        }
      );

      if (response?.data) {
        console.log("User Profile Data:", response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setUser(response.data);
        toast.success("User profile fetched successfully!");
      } else {
        throw new Error("Failed to fetch user profile data.");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("An error occurred while fetching user profile.");
    }
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.clear();
    setUser(null);
    toast.success("Logged out successfully!");
  };

  return (
    <div className="p-3 flex justify-between items-center px-5">
      <a href="/">
        <img src="/logo1.png" alt="Logo" className="h-20 w-22 mt-0 mx-2" />
      </a>
      <div className="flex items-center gap-6">
        {/* Always Visible Buttons */}
        <a href="/about">
          <Button
            variant="outline"
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all shadow-md px-4 py-6"
          >
            About Us
          </Button>
        </a>
        <a href="/contact">
          <Button
            variant="outline"
            className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all shadow-md px-4 py-6"
          >
            Contact Us
          </Button>
        </a>

        {/* User-Specific Actions */}
        {user ? (
          <div className="flex items-center gap-3">
            <a href="/create-trip">
              <Button
                variant="outline"
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all shadow-md px-4 py-6"
              >
                + Create Trip
              </Button>
            </a>

            <a href="/my-trips">
              <Button
                variant="outline"
                className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-all shadow-md px-4 py-6"
              >
                My Trips
              </Button>
            </a>

            <Popover>
              <PopoverTrigger className="flex items-center space-x-2 px-2 py-2 rounded-full border-none cursor-pointer hover:bg-gray-100 bg-gradient-to-r from-purple-500 to-pink-500 hover:opacity-90 transition-all shadow-md">
                <img
                  src={user.picture || "/placeholder.png"} // Use placeholder if picture is missing
                  alt="User Profile"
                  className="h-9 w-9 rounded-full border-2 border-blue-500 shadow-md hover:scale-105 transition-transform"
                />
                <span
                  variant="outline"
                  className="text-sm font-medium text-gray-700 hover:text-black"
                >
                  {user.name || "User"}{" "}
                  <i className="fas fa-caret-down text-gray-500"></i>
                </span>
              </PopoverTrigger>
              <PopoverContent className="mt-2 w-48 rounded-lg bg-white shadow-lg border border-gray-200 py-2">
                <Button
                  variant="outline"
                  className="w-full px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all shadow-md"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign Up</Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <h2 className="font-bold text-lg mt-7">Sign in with Google</h2>
              <p>Sign in securely to generate your trip plan.</p>
              <Button
                disabled={loading}
                onClick={login}
                className="w-full mt-5 flex gap-4 items-center"
              >
                {loading ? "Signing In..." : "Sign in with Google"}
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
