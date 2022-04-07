const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://anish:lXcN9IDyBWaSkwD2@cluster0.snklh.mongodb.net/fileUpload?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));
