import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import KEYS from "./keys.js";
import mongoose from "mongoose";
import createCarbonData from "./middleware/createCarbonData.js";
import Carbon from "./models/carbon.js";
const app = express();
const httpServer = http.createServer(app);
const options = {
  /* ... */
};
const PORT = 5000;
const { MONGO_URI } = KEYS;

app.use(cors());

const io = new Server(httpServer, options, {
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  Carbon.find().sort({ time: -1 }).limit(50).then(result=>{
    socket.emit("dataHistory", result)
})
.catch(err=>{
    console.log(err)
})

// highest Value

Carbon.find().sort({ value: -1}).limit(1).then(result=>{
    socket.emit("highestValue", result)
})
.catch(err=>{
    console.log(err)
})

// Niedrichster Wert mit Datum

  Carbon.find().sort({ value: 1}).limit(1).then(result=>{
    socket.emit("lowestValue", result)
})
.catch(err=>{
    console.log(err)
})

//mean (alleAddiert/länge) (von:value:-1)(bis:value:+1)

Carbon.find().then(result=>{
  let länge = result.length;
  let alleAdd = 0;
  result.map(item=>alleAdd+=item.value)
  let mean = alleAdd/länge;
  const end = {länge: länge, alleAdd: alleAdd, mean: mean};
  socket.emit("meanVal", end)

})
.catch(err=>{
  console.log(err)
})

// erste Messung, letzte Messung

Carbon.find().sort({ time: 1}).limit(1).then(result=>{
  const first = result[0].time;
  socket.emit("firstRecord", first)
})
.catch(err=>{
  console.log(err)
})


Carbon.find().sort({ time: -1}).limit(1).then(result=>{
  const latest = result[0].time;
  socket.emit("lastRecord", latest)
})
.catch(err=>{
  console.log(err)
})

  
  setInterval(() => {
    let newData = toSend;
    socket.emit("newData", newData);
  }, 10000);
});

let toSend;

setInterval(async () => {
    let newData = await createCarbonData();
    toSend = newData;
  }, 10000);

mongoose.connect(MONGO_URI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongoose");
});

mongoose.connection.on("error", (err) => {
  console.log("error in connection", err);
});

app.use(express.json());


httpServer.listen(PORT, () => {
  console.log("server is running on port", PORT);
});
