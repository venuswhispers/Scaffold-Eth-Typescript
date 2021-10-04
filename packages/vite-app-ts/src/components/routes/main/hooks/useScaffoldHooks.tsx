import { useEffect } from 'react';
import { ethers } from 'ethers';
import { TEthersUser } from 'eth-hooks/models';
import { IScaffoldAppProviders } from '~~/components/routes/main/hooks/useScaffoldAppProviders';
import { DEBUG } from '../MainPage';
import { useBalance, useContractReader, useOnRepetition } from 'eth-hooks';
import { useEnsResolveName } from 'eth-hooks/dapps';

/**
 * Logs to console current app state.  Shows you examples on how to use hooks!
 *
 * @param scaffoldAppProviders
 * @param currentEthersUser
 * @param readContracts
 * @param writeContracts
 * @param mainnetContracts
 */
export const useScaffoldHooks = (
  scaffoldAppProviders: IScaffoldAppProviders,
  currentEthersUser: TEthersUser,
  readContracts: Record<string, ethers.Contract>,
  writeContracts: Record<string, ethers.Contract>,
  mainnetContracts: Record<string, ethers.Contract>
) => {
  let currentChainId: number | undefined = currentEthersUser.providerNetwork?.chainId;

  // ---------------------
  // 🏦 get your balance
  // ---------------------
  // 🏗 scaffold-eth is full of handy hooks like this one to get your balance:
  const yourLocalBalance = useBalance(currentEthersUser.address ?? '');

  // ---------------------
  // 🤙🏽 calling an external function
  // ---------------------
  // Just plug in different 🛰 providers to get your balance on different chains:
  // const yourMainnetBalance = useBalance(scaffoldAppProviders.mainnetProvider, currentEthersUser.address ?? '');

  // 💰 Then read your DAI balance like:
  const myMainnetDAIBalance = useContractReader(mainnetContracts, {
    contractName: 'DAI',
    functionName: 'balanceOf',
    functionArgs: ['0x34aA3F359A9D614239015126635CE7732c18fDF3'],
  });

  // ---------------------
  // 📛 call ens
  // ---------------------
  // const addressFromENS = useEnsResolveName(scaffoldAppProviders.mainnetProvider, 'austingriffith.eth');
  // console.log('🏷 Resolved austingriffith.eth as:', addressFromENS);

  // ---------------------
  // 🔁 onBlock or on polling
  // ---------------------
  // This hook will let you invoke a callback on every block or with a polling time!
  // on block is prefferedmai
  useOnRepetition(
    (): void => console.log(`⛓ A new mainnet block is here: ${scaffoldAppProviders.mainnetProvider._lastBlockNumber}`),
    {
      provider: scaffoldAppProviders.mainnetProvider,
    }
  );

  useEffect(() => {
    if (
      DEBUG &&
      scaffoldAppProviders.mainnetProvider &&
      currentEthersUser.address &&
      currentChainId &&
      yourLocalBalance &&
      // yourMainnetBalance &&
      readContracts &&
      writeContracts &&
      mainnetContracts
    ) {
      console.log('_____________________________________ 🏗 scaffold-eth _____________________________________');
      console.log('🌎 mainnetProvider', scaffoldAppProviders.mainnetProvider);
      console.log('🏠 localChainId', scaffoldAppProviders.localProvider.network.chainId);
      console.log('👩‍💼 selected address:', currentEthersUser.address);
      console.log('🕵🏻‍♂️ currentChainId:', currentChainId);
      console.log('💵 yourLocalBalance', yourLocalBalance ? ethers.utils.formatEther(yourLocalBalance) : '...');
      // console.log('💵 yourMainnetBalance', yourMainnetBalance ? ethers.utils.formatEther(yourMainnetBalance) : '...');
      console.log('📝 readContracts', readContracts);
      console.log('🌍 DAI contract on mainnet:', mainnetContracts);
      console.log('💵 yourMainnetDAIBalance', myMainnetDAIBalance);
      console.log('🔐 writeContracts', writeContracts);
    }
  }, [
    scaffoldAppProviders.mainnetProvider,
    currentEthersUser.address,
    currentEthersUser.provider,
    readContracts,
    writeContracts,
    mainnetContracts,
  ]);
};
