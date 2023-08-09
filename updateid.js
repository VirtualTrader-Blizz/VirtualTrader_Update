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

connection.connect((err) => {
  if (err) throw err;
  console.log("Connecté à la base de données.");
  updateCoinGeckoIds();
});

const updateCoinGeckoIds = async () => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/coins/list"
    );
    const coinsList = response.data;

    connection.query(
      "SELECT stock_id, symbol FROM stocks WHERE coingecko_id IS NULL",
      (err, results) => {
        if (err) throw err;

        results.forEach((row) => {
          const symbol = row.symbol;

          const coinEntry = coinsList.find((coin) => coin.symbol === symbol);

          if (coinEntry) {
            connection.query(
              "UPDATE stocks SET coingecko_id = ? WHERE stock_id = ?",
              [coinEntry.id, row.stock_id],
              (err, result) => {
                if (err) throw err;
                console.log(
                  `Mise à jour du coingecko_id pour le symbole ${symbol}`
                );
              }
            );
          } else {
            console.warn(
              `Aucune correspondance trouvée pour le symbole ${symbol}`
            );
          }
        });
      }
    );
  } catch (error) {
    console.error(error);
  }
};
