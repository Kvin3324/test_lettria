const { ObjectId } = require("mongodb")
const { verify, sign } = require("jsonwebtoken");
const { randomFill } = require("crypto");
const { promisify } = require("util");
const { MongoClient } = require("mongodb")
const createToken = promisify(randomFill);

exports.GET = async function (userInput) {
  const mongo = await MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true });

  return verify(userInput.token, userInput.jwtId.toString("hex"), async function (error, token) {
    if (error) {
      if (error.expiredAt) {
        const payload = { name: userInput.mail, exp: Math.floor(Date.now() + 60 * 8640 * 1000) };
        const jwtId = await createToken(Buffer.alloc(16));
        const createJwt = promisify(sign);
        const userToken = await createJwt(payload, jwtId.toString("hex"));

        if (typeof userToken === "object") {
          return {
            code: 500,
            forClient: {
              serverMessage: "Something went wrong with the server."
            }
          }
        }

        await mongo.db().collection("Users").findOneAndUpdate(
          { _id: new ObjectId(userInput._id) },
          {
            $set: {
              token: userToken
            }
          }
        );

        await mongo.close()
        return {
          code: 200,
          forClient: {
            newToken: userToken,
            inputContent: userInput.inputContent
          }
        }
      }

      await mongo.close()
      return {
        code: 401,
        forClient: {
          error: true,
          serverMessage: "Invalid token."
        }
      }
    }

    await mongo.close()
    return {
      code: 200,
      forClient: {
        inputContent: userInput.inputContent
      }
    }
  })
}

exports.POST = async function (userInput, clientData) {
  const mongo = await MongoClient.connect(process.env.DB_URL, { useUnifiedTopology: true });

  return verify(userInput.token, userInput.jwtId.toString("hex"), async function (error, token) {
    if (error) {
      if (error.expiredAt) {
        const payload = { name: userInput.mail, exp: Math.floor(Date.now() + 60 * 8640 * 1000) };
        const jwtId = await createToken(Buffer.alloc(16));
        const createJwt = promisify(sign);
        const userToken = await createJwt(payload, jwtId.toString("hex"));

        if (typeof userToken === "object") {
          return {
            code: 500,
            forClient: {
              serverMessage: "Something went wrong with the server."
            }
          }
        }

        const newInputContent = await mongo.db().collection("Users").findOneAndUpdate(
          { _id: new ObjectId(userInput._id) },
          {
            $set: {
              token: userToken,
              inputContent: userInput.inputContent.concat(clientData)
            }
          },
          {
            projection: {
              inputContent: 1
            }
          }
        );

        await mongo.close();
        return {
          code: 200,
          forClient: {
            newToken: userToken,
            inputContent: newInputContent.inputContent
          }
        }
      }

      await mongo.close();
      return {
        code: 401,
        forClient: {
          error: true,
          serverMessage: "Invalid token."
        }
      }
    }

    const newInputContent = await mongo.db().collection("Users").findOneAndUpdate(
      { _id: new ObjectId(userInput._id) },
      {
        $set: {
          inputContent: userInput.inputContent.concat(clientData)
        }
      },
      {
        projection: {
          inputContent: 1
        }
      }
    );

    await mongo.close();
    return {
      code: 200,
      forClient: {
        serverMessage: "Added input.",
        inputContent: newInputContent.value.inputContent
      }
    }
  })
}