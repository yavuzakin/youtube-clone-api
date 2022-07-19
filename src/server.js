import app from "./app.js";
import connectToDb from "./utils/mongoDb.js";

connectToDb();

const port = process.env.PORT || 3000;
app.listen(() => {
  console.log(`App running on ${port}...`);
});
