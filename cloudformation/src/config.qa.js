"use strict";

const config = {
  // Configurable on stack creation:
  serverSSHAccessIp: "186.96.182.141/32",
  serverSSHKeyPair: "kportal-qa",
  awsRegion: "us-east-2",
  awsAccountId: "709269308530",
  gitHubOAuthToken: "",
  gitHubOwner: "Ksquare-University",
  gitHubRepoBackend: "kportal-back",
  gitHubRepoFrontend: "kportal-front",
  backendBranch: "qa",
  frontendBranch: "qa",
  apiUrl: "qaportalapi.theksquaregroup.com",
  appUrl: "qaportal.theksquaregroup.com",
  // Non configurable on stack creation:
  appName: "kportalapp",
  env: "qa",
  backup: false,
  dbDeletionPolicy: "Delete",
  s3DeletionPolicy: "Delete",
  useRdsDB: false,
  codedeployStartCmd: "npm run docker:qa",
};

module.exports = {
  config,
};
