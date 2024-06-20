import Chakra from "./Chakra";
import Wagmi from "./Wagmi";

export default function AllProviders({children}: {children: React.ReactNode}) {
  return (
    <Chakra>
      <Wagmi>
        {children}
      </Wagmi>
    </Chakra>
  )
}
