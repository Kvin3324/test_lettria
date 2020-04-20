const { hash } = require("bcrypt");
const { sign } = require("jsonwebtoken");
const { randomFill } = require("crypto");
const { promisify } = require("util");
const { MongoClient } = require("mongodb")
const createToken = promisify(randomFill);

module.exports = async function (userInformations) {
  const mongo = await MongoClient.connect(process.env.DB_URL, {useUnifiedTopology: true});
  const user = await mongo.db().collection("Users").findOne({ mail: userInformations.mail });

  if (user) {
    mongo.close();
    return {
      code: 409,
      forClient: {
        error: true,
        serverMessage: "User already exists."
      }
    }
  }

  const hashPswd = await hash(userInformations.password, 10);
  const payload = { name: userInformations.mail, exp: Math.floor(Date.now() + 60 * 8640 * 1000) };
  const jwtId = await createToken(Buffer.alloc(16));
  const createJwt = promisify(sign);
  const userToken = await createJwt(payload, jwtId.toString("hex"));

  if (typeof createJwt === "object") {
    mongo.close();
    return {
      code: 500,
      forClient: {
        serverMessage: "Something went wrong with the server."
      }
    }
  }

  await mongo.db().collection("Users").insertOne({ mail: userInformations.mail, password: hashPswd, token: userToken, jwtId});
  mongo.close();

  return {
    code: 200,
    forClient: {
      serverMessage: "User created.",
      token: userToken
    }
  }
}