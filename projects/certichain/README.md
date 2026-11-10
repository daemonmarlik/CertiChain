# CertiChain

A blockchain-based certificate verification and revocation system built on Algorand.

## Problem
Traditional certificates can be forged or modified, making verification difficult.

## Solution
CertiChain stores certificate document hashes on the Algorand blockchain, allowing anyone to verify authenticity without storing personal information or certificate PDFs on-chain.

## Features
- Issue certificates (application creator/admin only)
- Verify certificates using document hashes
- Revoke previously issued certificates
- Reject incorrect hashes
- Reject verification of revoked certificates
- Store certificate hashes using Algorand Box storage

## Technology Stack
- Algorand Blockchain
- TEALScript
- TypeScript
- AlgoKit Utils
- Algorand SDK
- Jest
- Node.js

## Architecture
1. Admin submits a certificate ID and document hash.
2. Smart contract stores the hash on Algorand.
3. Anyone can submit a certificate ID and hash for verification.
4. The contract checks the stored hash and revocation status.
5. Admin can revoke a certificate.

## Test Results

LocalNet:
- Certificate issuance: Passed
- Correct hash verification: Passed
- Incorrect hash rejection: Passed
- Certificate revocation: Passed
- Revoked certificate rejection: Passed

TestNet:
- Deployment: Successful
- Certificate issuance: Successful
- Verification: Successful
- Revocation: Successful
- Post-revocation verification: Rejected correctly

## Algorand TestNet Deployment

Application ID: 775689650

Deployer address:
FJUQA627F5IWWCHPUOFC3COKCKJUNSL7WV25EMFB3F6JGFCZCG2RFCPDZQ

Deployment transaction:
HUKQ3CLBYYZI4D6YJIE7LDHLZ6KGUTPWCDWXVJO6NJ4O3TGRVR6A

Revocation transaction:
3BAOOKYGD4ZZ2XLEHHKNEB2N5AWZVNHKGCKRDOVOVMVJ34PSQ4LA

## Security and Privacy
- Only the application creator can issue and revoke certificates.
- Certificate documents and personal information are not stored on-chain.
- Only certificate hashes and minimal status data are stored.

## Current Limitations
- The current MVP validates hash length, with stricter hexadecimal validation planned.
- The demonstration uses a sample hash.
- A production frontend and certificate-upload workflow are future improvements.

## Future Scope
- Web-based certificate issuer dashboard
- QR-based public verification
- Certificate metadata and timestamps
- Integration with educational institutions

## License
MIT
