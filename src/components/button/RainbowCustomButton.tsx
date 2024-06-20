import { ConnectButton } from "@rainbow-me/rainbowkit";

interface Props {
  connectComponent?: React.ReactNode;
  disconnectComponent?: React.ReactNode;
  changeChainComponent?: React.ReactNode;
}

export default function RainbowCustomButton({
  connectComponent,
  disconnectComponent,
  changeChainComponent,
}: Props) {
  return (
    <ConnectButton.Custom>
      {
        ({
          account,
          chain,
          openAccountModal,
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
                  return <div className=" w-full h-full" onClick={openConnectModal}>{ connectComponent }</div>
                }

                if (disconnectComponent) {
                  return <div className=" w-full h-full" onClick={openAccountModal}>{ disconnectComponent }</div>
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
