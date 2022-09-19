import './MonkeyPatchFetch';
import './styles';
import './UIcomponents';

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
