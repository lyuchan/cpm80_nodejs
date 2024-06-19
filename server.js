const express = require("express");
const WebSocket = require('ws');
const app = express();
const server = app.listen(8080, () => {
    console.log("Application started and Listening on port 8080");
});
app.use(express.static(__dirname + "/web"));
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/web/index.html");
});
let v, a, w, f, sw, swflag;
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    ws.on('message', (message) => {
        let data = JSON.parse(message);
        if (data.get == "open") {
            sw = true;
        } else if (data.get == "colse") {
            sw = false;
        }
    });
    ws.on('close', () => {
    });
});
function send(data) {
    let clients = wss.clients;
    clients.forEach((client) => {
        client.send(data);
    });
}

let ipAddress = "192.168.50.134";
let port = 502; // Default Modbus TCP port
let id = 1; // 站號
let loopdelay = 250; // 循環讀取延遲(為0則只讀取一次)

var ModbusRTU = require("modbus-serial");
var clientw = new ModbusRTU();
clientw.connectTCP(ipAddress, { port: port });
clientw.setID(id);
if (loopdelay == 0) {
    read();
} else {
    setInterval(read, loopdelay);
}

// name                  address     type        長度
// votage                0x0000      FLOAT32     2
// current               0x0004      FLOAT32     2
// frequency             0x0014      FLOAT32     2
// pf                    0x0012      FLOAT32     2
// w                     0x0006      FLOAT32     2
// poweroutput(relay)    0x0209      INT16U      1

function read() {
    clientw.readHoldingRegisters(28688, 2).then((data) => {
        // console.log(data.buffer)
        v = buffertofloat32(data.buffer, 2);
    }).then(() => {
        return clientw.readHoldingRegisters(28696, 2).then((data) => {
            a = buffertofloat32(data.buffer, 2);
        });
    }).then(() => {
        return clientw.readHoldingRegisters(28672, 2).then((data) => {
            f = buffertofloat32(data.buffer, 2);
        });
    }).then(() => {
        return clientw.readHoldingRegisters(0x7022, 2).then((data) => {
            w = buffertofloat32(data.buffer, 2);
            console.log(`V:${v} A:${a} W:${w} F:${f}`);
            send(JSON.stringify({ v: v, i: a, p: w, f: f, sw: swflag }));
        });
    }).catch((err) => {
        console.log(err);
    });
}

function buffertofloat32(buffer, fixed) {
    return parseFloat((buffer.readFloatBE(0)).toFixed(fixed));
}