const axios = require("axios");

exports.getCryptoPrice = async (coingeckoId) => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price`,
    {
      params: {
        ids: coingeckoId,
        vs_currencies: "usd",
      },
    }
  );

  if (!response.data[coingeckoId]) {
    response = 100000000;
  }
  return response.data[coingeckoId].usd;
};
