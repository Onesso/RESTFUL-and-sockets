import express from 'express';

const app = express();


app.use("/api/get", (req, res) => {
    res.send("hello mofaka")
})


app.listen(8800, ()=>{
    console.log("server is running on port 8800")
})