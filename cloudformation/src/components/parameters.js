"use strict";
const { generateSecret } = require("../util");

module.exports = async config => ({
  ServerSSHAccessIp: {
    Type: "String",
    Default: config.serverSSHAccessIp,
    Description: "Your ip so you can access the server via SSH",
  },
  AwsRegion: {
    Type: "String",
    Default: config.awsRegion,
    Description: "AWS Region to use",
  },
  AwsAccountId: {
    Type: "String",
    Default: config.awsAccountId,
    Description: "AWS Account Id where this environment is being deployed",
  },
  GitHubOAuthToken: {
    Type: "String",
    Default: config.gitHubOAuthToken,
    NoEcho: true,
    Description:
      "A GitHub Personal Access token of an account that has access to the backend and frontend repos",
  },
  GitHubOwner: {
    Type: "String",
    Default: config.gitHubOwner,
    AllowedPattern: "[A-Za-z0-9-]+",
    Description: "The name of the account that owns the repositories",
  },
  GitHubRepoBackend: {
    Type: "String",
    Default: config.gitHubRepoBackend,
    AllowedPattern: "[A-Za-z0-9-]+",
    Description:
      "The name of the backend repository (only name, not the whole url)",
  },
  GitHubBranchBackend: {
    Type: "String",
    Default: config.backendBranch,
    AllowedPattern: "[A-Za-z0-9-/]+",
    Description: "The branch that we will be using to build this environment",
  },
});
