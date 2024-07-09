import Chakra from "./Chakra";
import Toast from "./Toast";
import Wagmi from "./Wagmi";


export default function AllProviders({children}: {children: React.ReactNode}) {
  return (
    <Chakra>
      <Wagmi>
        <Toast.ToastContainer />
        {children}
      </Wagmi>
    </Chakra>
  )
}
