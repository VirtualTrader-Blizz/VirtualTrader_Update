const dotenv = require("dotenv");
const cryptoModels = require("./models/crypto");
const api = require("./api/getCryptoPrice");
dotenv.config();

let currentId = 1;

const getCryptoPrice = async () => {
  const coingeckoIDRequest = await cryptoModels.getCoingeckoIDByID(currentId);
  const coingeckoID = coingeckoIDRequest[0][0].coingecko_id;
  const cryptoPrice = await api.getCryptoPrice(coingeckoID);
  await cryptoModels.setLastPrice(cryptoPrice, coingeckoID);
  currentId = await cryptoModels.getID(currentId);

  console.log(`New Price : ${coingeckoID} : ${cryptoPrice}$`);
};

setInterval(getCryptoPrice, 6000);
