const { ObjectId } = require("mongodb");

const getAdminStats = async (req, res) => {
  try {
    const db = req.db;
    const usersCollection = db.collection("users");
    const ordersCollection = db.collection("orders");
    const itemsCollection = db.collection("items");

    const usersCount = await usersCollection.countDocuments();
    const ordersCount = await ordersCollection.countDocuments();
    const itemsCount = await itemsCollection.countDocuments();

    res.send({
      users: usersCount,
      orders: ordersCount,
      items: itemsCount,
    });
  } catch (err) {
    res.status(500).send("Something went wrong");
  }
};

module.exports = { getAdminStats };
