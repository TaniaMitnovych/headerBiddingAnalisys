window.addEventListener('load', (event) => {
  console.log("init");
  //showInfo();
  createButton();
});

function init() {

}

function createButton() {
  let button = document.createElement("button");
  document.body.appendChild(button);
  button.type = "button";
  button.style.width = "100px";
  button.style.height = "50px";
  button.style.backgroundColor = "red";
  button.style.position = "fixed";
  button.style.bottom = "100px";
  button.style.right = "10px";
  button.onclick = showInfo;
}
function closeButton() {
  let button = document.createElement("button");
  document.appendChild(button);

  button.type = "button";
  button.style.width = "50px";
  button.style.height = "50px";
  button.style.backgroundColor = "blue";
  button.style.position = "fixed";
  button.style.bottom = "10px";
  button.style.right = "10px";
  button.onclick = showInfo;
}
function showInfo() {
  let iframe = createIframe("iframe__header-bidding-analisys");
  let adUnitsInfoTable = createTable(["Ad unit code", "Sizes", "Bidders", "Ad unit path"]);
  let biddersInfoTable=createTable(["Bidder name", "CPM", "Currency", "Size"]);
  iframe.contentWindow.document.body.appendChild(adUnitsInfoTable);
  iframe.contentWindow.document.body.appendChild(biddersInfoTable);

  if (typeof pbjs !== "undefined" && window.googletag && googletag.apiReady) {
    let adUnits = pbjs.adUnits;
    let GPTSlots = googletag.pubads().getSlots();
    let AdUnitPathDictionary=getAdUnitPathDictionary(GPTSlots);
    for (let i = 0; i < adUnits.length; i++) {
      adUnitsInfoTable = appendadUnitInfoIntoTable(adUnitsInfoTable, adUnits[i], AdUnitPathDictionary[adUnits[i].code]);
    }
    let bidders = pbjs.getAllWinningBids();
    for (let i = 0; i < bidders.length; i++) {
      biddersInfoTable=appendBiddersInfoIntoTable(biddersInfoTable,bidders[i]);
    }
  } else {
    console.log("nothing was found");
  }
  let button = iframe.contentWindow.document.createElement("button");
  iframe.contentWindow.document.body.appendChild(button);
  button.type = "button";
  button.style.width = "50px";
  button.style.height = "50px";
  button.style.backgroundColor = "blue";
  // button.style.position = "fixed";
  // button.style.bottom = "10px";
  // button.style.right = "10px";
  button.onclick = () => { iframe.parentNode.removeChild(iframe) }
}
function createIframe(iframeID = "") {
  let iframe = document.createElement("iframe");
  iframe.id = iframeID;
  iframe.style = "width: 80%;position: fixed;left: 10%;top: 10%;z-index: 10000;background-color: white;height: 80%;";
  document.body.appendChild(iframe);
  return iframe;
}
function createTable(tableHeaders = []) {
  let table = document.createElement("table");
  let tr = document.createElement("tr");
  table.appendChild(tr);
  for (let i = 0; i < tableHeaders.length; i++) {
    let th = document.createElement("th");
    let text = document.createTextNode(tableHeaders[i]);
    tr.appendChild(th);
    th.appendChild(text);
  }
  return table;
}
function appendadUnitInfoIntoTable(table, adUnit, adUnitPath) {
  let tr = document.createElement("tr")
  table.appendChild(tr);

  let td_adUnitCode = document.createElement("td");
  let adUnitCode = adUnit.code;
  tr.appendChild(td_adUnitCode);
  td_adUnitCode.appendChild(document.createTextNode(adUnitCode));

  let sizesSet = new Set();
  let bidders = new Set();
  for (let i = 0; i < adUnit.bids.length; i++) {
    if (adUnit.bids[i].params.size !== undefined) {
      console.log(adUnit.bids[i].params.size);
      if (Array.isArray(adUnit.bids[i].params.size)) {
        if (adUnit.bids[i].params.size.length === 1) {
          sizesSet.add(adUnit.bids[i].params.size[0][0] + "x" + adUnit.bids[i].params.size[0][1]);
        } else if (adUnit.bids[i].params.size.length === 2) {
          sizesSet.add(adUnit.bids[i].params.size[0] + "x" + adUnit.bids[i].params.size[1]);
        }
      } else {
        sizesSet.add(adUnit.bids[i].params.size);
      }
    }
    bidders.add(adUnit.bids[i].bidder);
  }
  let td_sizes = document.createElement("td");
  let sizes = Array.from(sizesSet).join(",\n");
  tr.appendChild(td_sizes);
  td_sizes.appendChild(document.createTextNode(sizes));

  let td_bidders = document.createElement("td");
  bidders = Array.from(bidders).join(",\n");
  tr.appendChild(td_bidders);
  td_bidders.appendChild(document.createTextNode(bidders));

  let td_adUnitPath = document.createElement("td");
  tr.appendChild(td_adUnitPath);
  td_adUnitPath.appendChild(document.createTextNode(adUnitPath));

  return table;
}

function appendBiddersInfoIntoTable(table, bidder) {
  let tr = document.createElement("tr")
  table.appendChild(tr);

  let td_bidderName = document.createElement("td");
  let bidderName = bidder.bidder;
  tr.appendChild(td_bidderName);
  td_bidderName.appendChild(document.createTextNode(bidderName));

  let td_cpm = document.createElement("td");
  let cpm = bidder.cpm;
  tr.appendChild(td_cpm);
  td_cpm.appendChild(document.createTextNode(cpm));

  let td_currency = document.createElement("td");
  let currency = bidder.currency;
  tr.appendChild(td_currency);
  td_currency.appendChild(document.createTextNode(currency));

  let td_size = document.createElement("td");
  let size = bidder.size;
  tr.appendChild(td_size);
  td_size.appendChild(document.createTextNode(size));

  return table;
}

function getAdUnitPathDictionary(GPTSlots=[]){
  let AdUnitPathDictionary={};
  for(let i=0;i<GPTSlots.length;i++){
    let id=GPTSlots[i].getSlotId();
    if(Object.prototype.toString.call(id) === "[object Object]"){
      id=GPTSlots[i].getSlotId().getDomId();
    }
    AdUnitPathDictionary[id]=GPTSlots[i].getAdUnitPath();
  }
  return AdUnitPathDictionary;
}
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
    let [resource, config ] = args;
    config.method="POST";
    config.body=resource;
    // request interceptor starts
    resource = 'http://127.0.0.1:3000/';
    // request interceptor ends
    config.mode="no-cors";
    const response = await originalFetch(resource, config);

    // response interceptor here
    return response;
};
