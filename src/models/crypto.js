const db = require("../utils/db");

exports.getID = async (currentId) => {
  const idRequest = await db.execute("SELECT COUNT(*) AS count FROM stocks");
  const id = idRequest[0][0].count;

  currentId++;

  if (currentId > id) {
    currentId = 1;
  }

  return currentId;
};

exports.setLastPrice = (lastPrice, cryptoID) => {
  return db.execute(
    "UPDATE stocks SET last_price = ? WHERE stock_id = ?",
    [lastPrice, cryptoID],
    (err, result) => {
      if (err) throw err;
    }
  );
};

exports.getCoingeckoIDByID = (cryptoID) => {
  return db.execute("SELECT coingecko_id FROM stocks WHERE stock_id = ?", [
    cryptoID,
  ]);
};
