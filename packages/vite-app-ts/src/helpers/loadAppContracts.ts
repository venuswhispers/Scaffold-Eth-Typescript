import { TDeployedContracts, TExternalContracts } from 'eth-hooks/models';
import { TContractConfig } from 'eth-hooks';

const contractListPromise = import('../generated/contracts/hardhat_contracts.json');

/**
 * - run yarn compile and yarn deploy to generate hardhhat_contracts.json
 */
// @ts-ignore
const externalContractsPromise = import('../generated/contracts/external_contracts');

/**
 * LoadsAppContracts
 * - run yarn compile and yarn deploy to generate hardhhat_contracts.json
 * @returns
 */
export const loadAppContracts = async (): Promise<TContractConfig> => {
  const config: TContractConfig = {};

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    config.deployedContracts = ((await contractListPromise).default ?? {}) as unknown as TDeployedContracts;
  } catch {
    config.deployedContracts = undefined;
    console.warn(
      '😶 No deployed contracts file found: /generated/contracts/hardhat_contracts.json, please run hardhat compile & deploy!'
    );
  }
  try {
    config.externalContracts = ((await externalContractsPromise).default ?? {}) as unknown as TExternalContracts;
  } catch {
    config.externalContracts = undefined;
    console.warn('😶 No external contracts file found: /generated/contracts/external_contracts');
  }
  return config;
};
