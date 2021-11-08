"use strict";

const config = {
  // Configurable on stack creation:
  serverSSHAccessIp: "187.190.168.85/32",
  awsRegion: "us-east-2",
  awsAccountId: "458201570005",
  gitHubOAuthToken: "",
  gitHubOwner: "diegollanespasos",
  gitHubRepoBackend: "codebuild-docker-demo",
  backendBranch: "master",
  // Non configurable on stack creation:
  appName: "cloudformation-app",
  env: "production",
};

module.exports = {
  config,
};
