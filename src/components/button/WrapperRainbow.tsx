import { ConnectButton } from "@rainbow-me/rainbowkit";

interface Props {
  connectComponent?: React.ReactNode;
  disconnectComponent?: React.ReactNode;
  changeChainComponent?: React.ReactNode;
  onOpenConnectWalletModal?: () => void;
}

export default function WrapperRainbow({
  connectComponent,
  disconnectComponent,
  changeChainComponent,
  onOpenConnectWalletModal,
}: Props) {
  
  return (
    <ConnectButton.Custom>
      {
        ({
          account,
          chain,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');
              
          return (
            <div className={`${!ready && 'opacity-0'} h-full`}>
              {(() => {
                if (connectComponent && !connected) {
                  return <div className=" w-full h-full" onClick={() => {
                    openConnectModal()
                    onOpenConnectWalletModal?.()
                  }}>{ connectComponent }</div>
                }

                if (disconnectComponent) {
                  return <div className=" w-full h-full">{ disconnectComponent }</div>
                }

                if (changeChainComponent) {
                  return <div className=" w-full h-full" onClick={openChainModal}>{ changeChainComponent }</div>
                }

                return <></>
              })()}
            </div>
          )
        }
      }
    </ConnectButton.Custom>
  )
}
