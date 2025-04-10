import api from "@/lib/axios";
import { LogOutIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { User } from "@/types/type";

const NavBar = ({ user }: { user: User }) => {
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await api.post("auth/logout");
      localStorage.removeItem("accessToken");
      delete api.defaults.headers.common["Authorization"];
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };
  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 mx-auto">
        <div className="flex items-center gap-2 font-semibold">
          <Link to={"/dashboard"}>
            <span className="text-xl">Task Manager</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-sm md:inline-block">
            {String(user?.name).charAt(0).toUpperCase() +
              String(user?.name).slice(1)}
          </span>
          <button className="rounded-full hover:bg-gray-100">
            <div className="w-10 h-10 rounded-full bg-blue-500 text-primary-foreground flex items-center justify-center">
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
          </button>
          <button
            onClick={handleLogout}
            className="px-2 py-2 bg-gray-200 rounded-2xl transition hover:bg-gray-100 flex items-center"
          >
            <LogOutIcon className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
