"use strict";

const config = {
  // Configurable on stack creation:
  serverSSHAccessIp: "186.96.182.141/32",
  serverSSHKeyPair: "kportal-dev",
  awsRegion: "us-east-2",
  awsAccountId: "709269308530",
  gitHubOAuthToken: "",
  gitHubOwner: "Ksquare-University",
  gitHubRepoBackend: "kportal-back",
  gitHubRepoFrontend: "kportal-front",
  backendBranch: "develop",
  frontendBranch: "develop",
  apiUrl: "devportalapi.theksquaregroup.com",
  appUrl: "devportal.theksquaregroup.com",
  // Non configurable on stack creation:
  appName: "kportalapp",
  env: "dev",
  backup: false,
  dbDeletionPolicy: "Delete",
  s3DeletionPolicy: "Delete",
  useRdsDB: false,
  codedeployStartCmd: "npm run docker:dev",
};

module.exports = {
  config,
};
