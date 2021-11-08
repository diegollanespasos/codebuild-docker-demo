"use strict";
const base64url = require("base64-url");
const crypto = require("crypto");

function generateSecret() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buf) => {
      if (err) return reject(err);
      const token = base64url.encode(buf);
      return resolve(token);
    });
  });
}

module.exports = {
  generateSecret,
};
