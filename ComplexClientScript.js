const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
    let [resource, config ] = args;
    config.method="POST";
    config.body=resource;
    resource = 'http://127.0.0.1:3000/';
    config.mode="no-cors";
    const response = await originalFetch(resource, config);

    return response;
};
function createButton(buttonId="", buttonClassName="", destinationDocument, onclickFunction, text) {
  let button = document.createElement("button");
  destinationDocument.body.appendChild(button);
  button.type = "button";
  button.className=buttonClassName;
  button.id=buttonId;
  button.onclick = onclickFunction;
  button.innerText=text;
  return button;
}
function createIframe(iframeID = "") {
  let iframe = document.createElement("iframe");
  iframe.id = iframeID;
  iframe.className=iframeID;
  iframe.style = "width: 80%;position: fixed;left: 10%;top: 10%;z-index: 10000;background-color: white;height: 80%;";
  document.body.appendChild(iframe);
  return iframe;
}
function createTable(tableHeaders = [], tableID="") {
  let table = document.createElement("table");
  table.id=tableID;
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

function injectStylesForParentDocument() {
  //headerBiddingAnalisysButtonStyles();
  let style = document.createElement("style");
  style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
      .button__header-bidding-analisys{
        width:100px;
        height:80px;
        background-color:#1982c4 !important;
        color:#ffffff !important;
        font-family: 'Montserrat', sans-serif !important;
        border-radius:5px !important;
        border: 1px solid #ffffff !important;
        position:fixed;
        top:10px;
        right:10px;
        z-index:10000;
        white-space:break-spaces;
        font-size:10px !important;
        text-align:center;
      }
      .button__header-bidding-analisys:hover{
        background-color:#0E4788 !important;
      }
      

  `
  document.head.appendChild(style);
}
function injectStylesForChildDocument() {
  let style = document.createElement("style");
  style.innerHTML = `
        @import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
        .iframe__close-button{
          width:100px;
          background-color:#1982c4 !important;
          color:#ffffff !important;
          font-family: 'Montserrat', sans-serif !important;
          border-radius:5px !important;
          border: 1px solid #ffffff !important;
          font-size:14px !important;
          text-align:center;
          display:block;
          margin: 0 auto;
          padding: 5px;
          bottom:10px;
          margin-top:20px;

        }
        .iframe__close-button:hover{
          background-color:#0E4788 !important;
        }
        body{
          border-radius:5px;
          padding:10px;
          font-family: 'Montserrat', sans-serif !important;
          display:flex;
          align-items: center;
          flex-direction:column;
        }
        .iframe__header-bidding-analisys h1,
        .iframe__header-bidding-analisys h2 {
          text-align:center;
        }
        .iframe__header-bidding-analisys table{
          width:90%;
        }
        .iframe__header-bidding-analisys td{
          border:1px solid #000000;
          padding:10px;
        }
  `
  let iframe=document.getElementById("iframe__header-bidding-analisys");
  iframe.contentWindow.document.head.appendChild(style);
}


function init() {
  window.addEventListener('load', (event) => {
    createButton(
      "button__header-bidding-analisys",
      "button__header-bidding-analisys",
      document,
      showInfo, 
      "Show header bidding analisys");
      injectStylesForParentDocument();
  });
}
init();

function showInfo() {
  let iframe = createIframe("iframe__header-bidding-analisys");

  let adUnitsInfoTable = createTable(["Ad unit code", "Sizes", "Bidders", "Ad unit path"], "iframe__ad-units-table");
  let biddersInfoTable = createTable(["Bidder name", "CPM", "Currency", "Size"], "iframe__ssp-list-table");

  if (typeof pbjs !== "undefined" && window.googletag && googletag.apiReady) {
    iframe.contentWindow.document.body.appendChild(adUnitsInfoTable);
    iframe.contentWindow.document.body.appendChild(biddersInfoTable);
    let adUnits = pbjs.adUnits;
    let GPTSlots = googletag.pubads().getSlots();
    let AdUnitPathDictionary = getAdUnitPathDictionary(GPTSlots);
    if(adUnits.length===0){
      iframe.contentWindow.document.body.appendChild(document.createTextNode("Nothing was found"));
    }
    for (let i = 0; i < adUnits.length; i++) {
      adUnitsInfoTable = appendadUnitInfoIntoTable(adUnitsInfoTable, adUnits[i], AdUnitPathDictionary[adUnits[i].code]);
    }
    let bidders = pbjs.getAllWinningBids();
    if(bidders.length===0){
      iframe.contentWindow.document.body.appendChild(document.createTextNode("Nothing was found"));
    }
    for (let i = 0; i < bidders.length; i++) {
      biddersInfoTable = appendBiddersInfoIntoTable(biddersInfoTable, bidders[i]);
    }
  } else {
    iframe.contentWindow.document.body.appendChild(document.createTextNode("Nothing was found"));
  }
  createButton(
        "iframe__close-button", 
        "iframe__close-button", 
        iframe.contentWindow.document, 
        () => { iframe.parentNode.removeChild(iframe) },
        "Close");
  completeIframe();
  injectStylesForChildDocument();
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
      sizesSet.add(getAdUnitBidSize(adUnit.bids[i]))
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

function getAdUnitPathDictionary(GPTSlots = []) {
  let AdUnitPathDictionary = {};
  for (let i = 0; i < GPTSlots.length; i++) {
    let id = GPTSlots[i].getSlotId();
    if (Object.prototype.toString.call(id) === "[object Object]") {
      id = GPTSlots[i].getSlotId().getDomId();
    }
    AdUnitPathDictionary[id] = GPTSlots[i].getAdUnitPath();
  }
  return AdUnitPathDictionary;
}

function getAdUnitBidSize(bid){
  if (Array.isArray(bid.params.size)) {
    if (bid.params.size.length === 1) {
      return (bid.params.size[0][0] + "x" + bid.params.size[0][1]);
    } else if (bid.params.size.length === 2) {
      return (bid.params.size[0] + "x" + bid.params.size[1]);
    }
  } else {
    return (bid.params.size);
  }
}
function completeIframe(){
  let iframe=document.getElementById("iframe__header-bidding-analisys");
  let header=document.createElement("h1");
  iframe.contentWindow.document.body.prepend(header);
  header.className="iframe__header";
  header.innerText="Header bidding analisys";
  
  let headerTable1=document.createElement("h2");
  header.after(headerTable1);
  headerTable1.className="iframe__table-header";
  headerTable1.innerText="Ad units` configuration";
  

  let headerTable2=document.createElement("h2");
  let table=iframe.contentWindow.document.getElementById("iframe__ad-units-table");
  if(table!==null){
    table.after(headerTable2);
  }else{
    headerTable1.after(headerTable2);
  }
  headerTable2.className="iframe__table-header";
  headerTable2.innerText="SSP list";
  
}

