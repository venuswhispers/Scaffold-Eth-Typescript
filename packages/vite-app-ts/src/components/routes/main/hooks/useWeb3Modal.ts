import { ExternalProvider, JsonRpcFetchFunc, Web3Provider } from '@ethersproject/providers';
import input from 'antd/lib/input';
import { TEthersProvider } from 'eth-hooks/models';
import { ethers } from 'ethers';
import { useCallback, useEffect, useRef, useState } from 'react';
import Web3Modal, { ICoreOptions } from 'web3modal';

export interface IWeb3ModalState {
  initialized: boolean;
  openWeb3Modal: () => void;
  logoutOfWeb3Modal: () => void;
}

const const_web3DialogClosedByUser = 'Modal closed by user';
export const useWeb3Modal = (
  web3ModalConfig: Partial<ICoreOptions>,
  setCurrentProvider: React.Dispatch<React.SetStateAction<TEthersProvider | undefined>>
): IWeb3ModalState => {
  const web3ModalProviderRef = useRef<Web3Modal>();
  const initalizedRef = useRef<boolean>();

  useEffect(() => {
    web3ModalProviderRef.current = new Web3Modal(web3ModalConfig ?? {});
    initalizedRef.current = false;
    setCurrentProvider(undefined);
  }, [web3ModalConfig]);

  const reload = useCallback(() => {
    return (_param: any) => {
      web3ModalProviderRef.current?.cachedProvider &&
        setTimeout(() => {
          window.location.reload();
        }, 1);
    };
  }, []);

  const logoutOfWeb3Modal = useCallback(async () => {
    await web3ModalProviderRef.current?.clearCachedProvider();
    setCurrentProvider(undefined);
    // setTimeout(() => {
    //   window.location.reload();
    // }, 1);
  }, [web3ModalProviderRef]);

  const loadWeb3Modal = useCallback(async () => {
    try {
      const provider = await web3ModalProviderRef.current?.connect();
      setCurrentProvider(new Web3Provider(provider));
      initalizedRef.current = true;

      provider.on('chainChanged', (chainId: number) => {
        console.log(`chain changed to ${chainId}! updating providers`);
        setCurrentProvider(new Web3Provider(provider));
      });

      provider.on('accountsChanged', () => {
        console.log(`account changed!`);
        setCurrentProvider(new Web3Provider(provider));
      });

      // Subscribe to session disconnection
      provider.on('disconnect', (code: any, reason: any) => {
        console.log(code, reason);
        logoutOfWeb3Modal();
      });
    } catch (e) {
      if ((e as string).includes(const_web3DialogClosedByUser)) {
        initalizedRef.current = true;
      }
      console.log(e);
    }
  }, [setCurrentProvider, logoutOfWeb3Modal]);

  useEffect(() => {
    //if (web3ModalProviderRef.current.cachedProvider) {
    loadWeb3Modal();
    //}
  }, [loadWeb3Modal]);

  const openWeb3Modal = useCallback(() => {
    setCurrentProvider(undefined);
    web3ModalProviderRef.current?.clearCachedProvider();
    loadWeb3Modal();
  }, [loadWeb3Modal]);

  useEffect(() => {
    if (window?.ethereum?.on && window?.ethereum?.off) {
      window.ethereum.on('chainChanged', reload);
      window.ethereum.on('accountsChanged', reload);
      return () => {
        /* eslint-disable */
        window.ethereum.off('chainChanged', reload);
        window.ethereum.off('chainChanged', reload);
        /* eslint-enable */
      };
    }
  }, [window?.ethereum]);

  return { initialized: initalizedRef.current ?? false, openWeb3Modal, logoutOfWeb3Modal };
};
