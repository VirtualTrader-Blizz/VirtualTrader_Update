const mysql = require("mysql");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

let currentId = 1;

const getCryptoPrice = async (id) => {
  try {
    connection.query(
      "SELECT coingecko_id FROM stocks WHERE stock_id = ?",
      [id],
      async (err, result) => {
        if (err) throw err;
        if (result.length === 0) return;

        const coingeckoId = result[0].coingecko_id;

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
          console.error(`Pas de données pour l'ID CoinGecko ${coingeckoId}`);
          return;
        }

        const price = response.data[coingeckoId].usd;

        connection.query(
          "UPDATE stocks SET last_price = ? WHERE stock_id = ?",
          [price, id],
          (err, result) => {
            if (err) throw err;
            console.log(`${coingeckoId} : New Price : ${price} $`);
          }
        );
      }
    );
  } catch (error) {
    console.error(error);
  }
};

const updateDatabase = async () => {
  await getCryptoPrice(currentId);

  connection.query("SELECT COUNT(*) AS count FROM stocks", (err, result) => {
    if (err) throw err;

    currentId++;
    if (currentId > result[0].count) {
      currentId = 1;
    }
  });
};

setInterval(updateDatabase, 6000);
