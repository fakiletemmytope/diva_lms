import app from "./app.js"
import { syncDb } from "./database/init_db.js";

const PORT = 3000

app.listen(PORT, async () => {
    await syncDb()
    console.log(`This is a mini learning platform version 1.0 listening on port ${PORT}`)
})