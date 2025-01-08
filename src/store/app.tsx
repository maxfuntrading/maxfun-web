import { ActionType } from "@/hooks/useCreateReducer";
import { Dispatch, createContext } from "react";

export interface AppIntialState {
  isLogin: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const appInitialState: AppIntialState = {
  isLogin: false,
};

export interface AppContextProps {
  state: AppIntialState;
  dispatch: Dispatch<ActionType<AppIntialState>>;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
}

const AppContext = createContext<AppContextProps>(undefined!);

export default AppContext;
