const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;


async function startServer() {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    await sequelize.sync(); // Remove { force: true } in production!

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start the server:", error);
    process.exit(1); // Exit with failure
  }
}

startServer();

process.on("SIGINT", async () => {
  try {
    await sequelize.close();
    console.log("Database connection closed.");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
});