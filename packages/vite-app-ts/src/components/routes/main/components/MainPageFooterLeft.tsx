import React, { FC } from 'react';
import { Row, Col, Button } from 'antd';
import { Ramp } from '~~/components/common';
import { Faucet, GasGauge } from 'eth-components/ant';
import { NETWORKS } from '~~/models/constants/networks';
import { TEthersProvider, TEthersUser } from 'eth-hooks/models';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';
import { getNetworkInfo } from '~~/helpers/getNetworkInfo';

interface IMainPageFooterLeft {
  scaffoldAppProviders: IScaffoldAppProviders;
  currentEthersUser: TEthersUser;
  price: number;
  gasPrice: number | undefined;
  faucetAvailable: boolean;
}

/**
 * 🗺 Extra UI like gas price, eth price, faucet, and support:
 * @param props
 * @returns
 */
export const MainPageFooterLeft: FC<IMainPageFooterLeft> = (props) => (
  <div
    style={{
      position: 'fixed',
      textAlign: 'left',
      left: 0,
      bottom: 20,
      padding: 10,
    }}>
    <Row align="middle" gutter={[4, 4]}>
      <Col span={8}>
        <Ramp price={props.price} address={props.currentEthersUser?.address ?? ''} networks={NETWORKS} />
      </Col>

      <Col
        span={8}
        style={{
          textAlign: 'center',
          opacity: 0.8,
        }}>
        <GasGauge
          chainId={props.scaffoldAppProviders.targetNetwork.chainId}
          currentNetwork={getNetworkInfo(props.currentEthersUser.providerNetwork?.chainId)}
          provider={props.currentEthersUser.provider}
          speed="average"
        />
      </Col>
      <Col
        span={8}
        style={{
          textAlign: 'center',
          opacity: 1,
        }}>
        <Button
          onClick={() => {
            window.open('https://t.me/joinchat/KByvmRe5wkR-8F_zz6AjpA');
          }}
          size="large"
          shape="round">
          <span
            style={{
              marginRight: 8,
            }}
            role="img"
            aria-label="support">
            💬
          </span>
          Support
        </Button>
      </Col>
    </Row>

    <Row align="middle" gutter={[4, 4]}>
      <Col span={24}>
        {
          /*  if the local provider has a signer, let's show the faucet:  */
          props.faucetAvailable && props.scaffoldAppProviders.mainnetProvider ? (
            <Faucet
              localProvider={props.currentEthersUser?.provider as any}
              price={props.price}
              ensProvider={props.scaffoldAppProviders.mainnetProvider}
            />
          ) : (
            <></>
          )
        }
      </Col>
    </Row>
  </div>
);
