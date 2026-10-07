import crypto from "crypto";

const verificationCode = crypto
  .randomInt(100000, 1000000)
  .toString();