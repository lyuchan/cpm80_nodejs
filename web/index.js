let urlold = window.location.href;//取得當前網址
let url = urlold.replace("https://", "");//去除https
url = url.replace("http://", "");//去除http
url = url.replace("out", "");//去除/
url = url.split('/')[0];
url = url.replace("/", "");//去除/
url = "ws://" + url;//加入ws://
let first = 0;
const socket = new WebSocket(url);
//socket.reconnectDecay = 1;
socket.onopen = () => {

}
socket.addEventListener('message', event => {
    // console.log('Message from server ', event.data);
    const data = JSON.parse(event.data); console.log(data)
    document.getElementById("vtable").innerHTML = `${data.v}V`
    document.getElementById("itable").innerHTML = `${data.i}A`
    document.getElementById("wtable").innerHTML = `${data.p}W`
    document.getElementById("ftable").innerHTML = `${data.f}HZ`
    getData(data.v, data.i, data.p)
});
function send(data) {
    socket.send(data);
}
function openrelay() {
    send(JSON.stringify({ get: "open" }))
}
function colserelay() {
    send(JSON.stringify({ get: "colse" }))
}

let data = []
let databuf = []
let j = 0
function getData(v, i, p) {
    // 取資料
    databuf.push({ observatory: "V", rainfall: v, observeDate: `${j}` })
    databuf.push({ observatory: "I", rainfall: i, observeDate: `${j}` })
    databuf.push({ observatory: "P", rainfall: p, observeDate: `${j}` })
    j = j + 0.01;
    console.log(databuf)
    // dataGet = await d3.csv('https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/5_OneCatSevNumOrdered.csv')
    //dataGet = i//await d3.json('https://data.coa.gov.tw/Service/OpenData/TransService.aspx?UnitId=5n9c3AlEJ2DH')
    // console.log(dataGet.filter(d => d.observeDate.substr(0, 4) === '2024'))
    data = databuf// dataGet.filter(d => d.observeDate.substr(0, 4) === '2024') // 只取2017的資料
    //  drawChart()
};
