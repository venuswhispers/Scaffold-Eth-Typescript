import React, { FC, useContext, useMemo, useState } from 'react';
import { Button } from 'antd';
import { useBalance } from 'eth-hooks';
import { transactor } from 'eth-components/functions';
import { parseEther } from '@ethersproject/units';
import { TEthersUser } from 'eth-hooks/models';
import { EthComponentsContext, IEthComponentsContext } from 'eth-components/models';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';

interface IFaucetButton {
  scaffoldAppProviders: IScaffoldAppProviders;
  gasPrice: number | undefined;
  currentEthersUser: TEthersUser;
}

export const getFaucetAvailable = (scaffoldAppProviders: IScaffoldAppProviders, currentEthersUser: TEthersUser) => {
  return (
    (true &&
      currentEthersUser?.provider &&
      currentEthersUser?.providerNetwork?.chainId === scaffoldAppProviders.targetNetwork.chainId &&
      scaffoldAppProviders.targetNetwork.name === 'localhost') ??
    false
  );
};

export const FaucetHintButton: FC<IFaucetButton> = (props) => {
  const context = useContext(EthComponentsContext);
  const yourLocalBalance = useBalance(props.currentEthersUser.provider, props.currentEthersUser.address ?? '');
  /**
   * create transactor for faucet
   */
  const faucetTx = transactor(context, props.scaffoldAppProviders.localProvider, props.gasPrice);

  /**
   * facuet is only available on localhost
   */
  const faucetAvailable = getFaucetAvailable(props.scaffoldAppProviders, props.currentEthersUser);

  const [faucetClicked, setFaucetClicked] = useState(false);

  const faucetHint = useMemo(() => {
    if (!faucetClicked && faucetAvailable && yourLocalBalance && yourLocalBalance.toBigInt() <= 0) {
      return (
        <div style={{ padding: 16 }}>
          <Button
            type="primary"
            onClick={(): void => {
              if (faucetTx) {
                void faucetTx({
                  to: props.currentEthersUser?.address,
                  value: parseEther('0.01'),
                });
              }
              setFaucetClicked(true);
            }}>
            💰 Grab funds from the faucet ⛽️
          </Button>
        </div>
      );
    } else {
      return <></>;
    }
  }, [faucetAvailable, yourLocalBalance, faucetTx, props.currentEthersUser?.address]);

  return <> {faucetHint} </>;
};
