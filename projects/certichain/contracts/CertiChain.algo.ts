import { Contract } from '@algorandfoundation/tealscript';

export class CertiChain extends Contract {

  certificateHashes = BoxMap<string, string>({
    prefix: 'h',
  });

  revokedCertificates = BoxMap<string, boolean>({
    prefix: 'r',
  });

  // Application creation
  createApplication(): void {}

  // Issue certificate (Admin only)
  issueCertificate(
    certificateId: string,
    documentHash: string
  ): void {

    assert(this.txn.sender === this.app.creator);

    assert(!this.certificateHashes(certificateId).exists);

    assert(documentHash.length === 64);

    this.certificateHashes(certificateId).value = documentHash;

    this.revokedCertificates(certificateId).value = false;
  }

  // Verify certificate (Anyone)
  verifyCertificate(
    certificateId: string,
    documentHash: string
  ): boolean {

    if (!this.certificateHashes(certificateId).exists) {
      return false;
    }

    if (!this.revokedCertificates(certificateId).exists) {
      return false;
    }

    if (this.revokedCertificates(certificateId).value) {
      return false;
    }

    return this.certificateHashes(certificateId).value === documentHash;
  }

  // Revoke certificate (Admin only)
  revokeCertificate(certificateId: string): void {

    assert(this.txn.sender === this.app.creator);

    assert(this.certificateHashes(certificateId).exists);

    assert(this.revokedCertificates(certificateId).exists);

    assert(!this.revokedCertificates(certificateId).value);

    this.revokedCertificates(certificateId).value = true;
  }
}
