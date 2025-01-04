import AllProviders from "@/components/providers/AllProviders";
import { useCreateReducer } from "@/hooks/useCreateReducer";
import AppContext, { AppIntialState, appInitialState } from "@/store/app";
import { Outlet } from "react-router-dom";

export default function App() {

  const contextValue = useCreateReducer<AppIntialState>({initialState: appInitialState})

  return (
    <AllProviders>
      <AppContext.Provider value={contextValue}>
        <div className="w-screen">
          <Outlet />
        </div>
      </AppContext.Provider>
    </AllProviders>
  )
}
