import { test, expect } from '@jest/globals';
import { AlgorandClient, Config } from '@algorandfoundation/algokit-utils';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import { CertiChainFactory } from '../contracts/clients/CertiChainClient';

Config.configure({ populateAppCallResources: true });

const deployTest =
  process.env.DEPLOY_TO_TESTNET === '1' ? test : test.skip;

deployTest('deploy CertiChain and test it on TestNet', async () => {
  const mnemonic = process.env.DEPLOYER_MNEMONIC;

  if (!mnemonic) {
    throw new Error('DEPLOYER_MNEMONIC is missing');
  }

  const algorand = AlgorandClient.testNet();
  const deployer = algorand.account.fromMnemonic(mnemonic);

  console.log('Deployer:', deployer.addr.toString());

  const factory = new CertiChainFactory({
    algorand,
    defaultSender: deployer.addr,
  });

  const createResult =
    await factory.send.create.createApplication();

  const appClient = createResult.appClient;

  console.log('CERTICHAIN APP ID:', appClient.appId.toString());

  await algorand.send.payment({
    sender: deployer.addr,
    receiver: appClient.appAddress,
    amount: AlgoAmount.Algos(1),
  });

  const certificateId = 'CERT-TESTNET-001';
  const hash = 'a'.repeat(64);

  await appClient.send.issueCertificate({
    args: { certificateId, documentHash: hash },
  });

  const verification = await appClient.send.verifyCertificate({
    args: { certificateId, documentHash: hash },
  });

  expect(verification.return).toBe(true);

  const revokeResult = await appClient.send.revokeCertificate({
    args: { certificateId },
  });

  const revoked = await appClient.send.verifyCertificate({
    args: { certificateId, documentHash: hash },
  });

  expect(revoked.return).toBe(false);

  console.log('ISSUE AND VERIFICATION: SUCCESS');
  console.log('REVOKE TX:', revokeResult.txIds[0]);
  console.log('TESTNET DEPLOYMENT: SUCCESS');
}, 120000);
