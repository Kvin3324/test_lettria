const { compare } = require("bcrypt");
const { MongoClient } = require("mongodb")

module.exports = async function (userInformations) {
  const mongo = await MongoClient.connect(process.env.DB_URL, {useUnifiedTopology: true});

  const user = await mongo.db().collection("Users").findOne(
    {mail: userInformations.mail},
    {
      projection: {
        mail: 1,
        password: 1,
        token: 1
      }
    });

  if (!user) {
    await mongo.close();
    return {
      code: 403,
      forClient: {
        error: true,
        serverMessage: "User unknown"
      }
    }
  }

   if (!await compare(userInformations.password, user.password)) {
    await mongo.close();
     return {
       code: 401,
       forClient: {
         error: true,
         serverMessage: "That email and password combination is incorrect."
       }
     }
   }

  await mongo.close();
  return {
    code: 200,
    forClient: {
      message: "User successfully connected.",
      id: user._id,
      token: user.token
    }
  }
}