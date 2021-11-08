"use strict";
const fs = require("fs");
const { config: configDev } = require("./src/config.dev");
const { config: configQa } = require("./src/config.qa");
const { config: configProd } = require("./src/config.prod");
const template = require("./src/template");

/*
  Generates AWS CloudFormation templates in json format.
    Input: src/template.js
    Output: cloudformation-templates/template.json
*/

async function main() {
  fs.writeFileSync(
    `cloudformation-templates/template.dev.json`,
    JSON.stringify(await template(configDev), null, 2),
  );
  fs.writeFileSync(
    `cloudformation-templates/template.qa.json`,
    JSON.stringify(await template(configQa), null, 2),
  );
  fs.writeFileSync(
    `cloudformation-templates/template.prod.json`,
    JSON.stringify(await template(configProd), null, 2),
  );
}

main();
