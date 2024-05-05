import { connect, disconnect } from "mongoose";
import { MONGO_URL, PORT } from "../../config.js";

export async function connectDb(app) {
  connect(MONGO_URL, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
  }).then((data) => {
    console.log(`Mongodb connected with server: ${data.connection.host}`);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    });
  });
};

export async function disconnectDb() {
  await disconnect();
};

