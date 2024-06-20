import AllProviders from "@/components/providers/AllProviders";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <AllProviders>
      <div className="w-full h-full container m-auto">
        <Outlet />
      </div>
    </AllProviders>
  )
}
