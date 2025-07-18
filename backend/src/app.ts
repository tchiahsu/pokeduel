import express from "express";
import battleRoutes from "./routes/battleRoutes";

const app = express();
const PORT = 3000;

app.use(express.json()) //parse incoming json files
app.use("/api/battle", battleRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})

