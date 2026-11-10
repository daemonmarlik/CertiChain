import { describe, test, expect, beforeAll } from '@jest/globals';
import { algorandFixture } from '@algorandfoundation/algokit-utils/testing';
import { Config } from '@algorandfoundation/algokit-utils';
import { AlgoAmount } from '@algorandfoundation/algokit-utils/types/amount';
import {
  CertiChainClient,
  CertiChainFactory,
} from '../contracts/clients/CertiChainClient';

const fixture = algorandFixture();

Config.configure({ populateAppCallResources: true });

let appClient: CertiChainClient;

describe('CertiChain', () => {
  beforeAll(async () => {
    await fixture.beforeEach();

    const { testAccount } = fixture.context;
    const { algorand } = fixture;

    const factory = new CertiChainFactory({
      algorand,
      defaultSender: testAccount.addr,
    });

    const createResult = await factory.send.create.createApplication();

    appClient = createResult.appClient;

    await algorand.send.payment({
      sender: testAccount.addr,
      receiver: appClient.appAddress,
      amount: AlgoAmount.Algos(1),
    });
  });

  test('complete certificate lifecycle', async () => {
    const certificateId = 'CERT-001';
    const correctHash = 'a'.repeat(64);
    const incorrectHash = 'b'.repeat(64);

    // Issue certificate
    await appClient.send.issueCertificate({
      args: { certificateId, documentHash: correctHash },
    });

    // Verify correct hash
    const validResult = await appClient.send.verifyCertificate({
      args: { certificateId, documentHash: correctHash },
    });

    expect(validResult.return).toBe(true);

    // Reject incorrect hash
    const invalidResult = await appClient.send.verifyCertificate({
      args: { certificateId, documentHash: incorrectHash },
    });

    expect(invalidResult.return).toBe(false);

    // Revoke certificate
    await appClient.send.revokeCertificate({
      args: { certificateId },
    });

    // Reject revoked certificate
    const revokedResult = await appClient.send.verifyCertificate({
      args: { certificateId, documentHash: correctHash },
    });

    expect(revokedResult.return).toBe(false);
  });
});
