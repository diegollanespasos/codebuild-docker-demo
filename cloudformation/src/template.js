"use strict";
const parameters = require("./components/parameters");
const cicd = require("./components/cicd");

/*
  Base CloudFormation template (JSON format)
    We are defining it in JS for flexibility
*/

module.exports = async config => ({
  AWSTemplateFormatVersion: "2010-09-09",
  Description: `Base Environment Configuration for ${config.appName}`,
  Parameters: await parameters(config),
  Resources: {
    ...cicd(config),
  },
  Outputs: {},
});
