window.addEventListener('load', (event) => {
  console.log("init");
  //showInfo();
  createButton();
});

function init() {
  
}

function createButton() {
  let button = document.createElement("button");
  document.appendChild(button);
  button.type = "button";
  button.style.width="100px";
  button.style.height="50px";
  button.style.backgroundColor="red";
  button.style.position="fixed";
  button.style.bottom="10px";
  button.style.right="10px";
  button.onclick=showInfo;
}
function showInfo() {
  let iframe=createIframe("iframe__header-bidding-analisys");
  let adUnitsInfoTable=createTable(["Ad unit code", "Sizes", "Bidders","Ad unit path"]);
  iframe.contentWindow.document.body.appendChild(adUnitsInfoTable);
  if (typeof pbjs !== "undefined" && window.googletag && googletag.apiReady) {
    let adUnits = pbjs.adUnits;
    let GPTSlots=googletag.pubads().getSlots();
    for(let i=0;i<adUnits.length;i++){
      adUnitsInfoTable=appendadUnitInfoIntoTable(adUnitsInfoTable,adUnits[i],GPTSlots[i+1]);
    }
    // let bidders = pbjs.getBidResponses();
    // if (Object.keys(bidders).length !== 0) {
    //   for (let i = 0; i < Object.keys(bidders).length; i++) {
    //     console.log(Object.keys(bidders)[i]);
    //   }
    // }
  }else{
    console.log("nothing was found");
  }
}
function createIframe(iframeID=""){
  let iframe=document.createElement("iframe");
  iframe.id=iframeID;
  iframe.style="width: 80%;position: fixed;left: 10%;top: 10%;z-index: 10000;background-color: white;height: 80%;";
  document.body.appendChild(iframe);
  return iframe;
}
function createTable(tableHeaders=[] ){
  let table=document.createElement("table");
  let tr=document.createElement("tr");
  table.appendChild(tr);
  for(let i=0;i<tableHeaders.length;i++){
    let th=document.createElement("th");
    let text=document.createTextNode(tableHeaders[i]);
    tr.appendChild(th);
    th.appendChild(text);
  }
  return table;
}
function appendadUnitInfoIntoTable(table, adUnit, GPTSlot){
  let tr=document.createElement("tr")
  table.appendChild(tr);

  let td_adUnitCode=document.createElement("td");
  let adUnitCode=adUnit.code;
  tr.appendChild(td_adUnitCode);
  td_adUnitCode.appendChild(document.createTextNode(adUnitCode));

  let sizesSet=new Set();
  let bidders=new Set();
  for(let i=0;i<adUnit.bids.length;i++){
    if(adUnit.bids[i].params.size!==undefined){
      console.log(adUnit.bids[i].params.size);
      if(Array.isArray(adUnit.bids[i].params.size)){
        if(adUnit.bids[i].params.size.length===1){
          sizesSet.add(adUnit.bids[i].params.size[0][0]+"x"+adUnit.bids[i].params.size[0][1]);
        }else if(adUnit.bids[i].params.size.length===2){
          sizesSet.add(adUnit.bids[i].params.size[0]+"x"+adUnit.bids[i].params.size[1]);
        }
      }else{
        sizesSet.add(adUnit.bids[i].params.size);
      }
    }
    bidders.add(adUnit.bids[i].bidder);
  }
  let td_sizes=document.createElement("td");
  let sizes=Array.from(sizesSet).join(",\n");
  tr.appendChild(td_sizes);
  td_sizes.appendChild(document.createTextNode(sizes));

  let td_bidders=document.createElement("td");
  bidders=Array.from(bidders).join(",\n");
  tr.appendChild(td_bidders);
  td_bidders.appendChild(document.createTextNode(bidders));

  let td_adUnitPath=document.createElement("td");
  let path=GPTSlot.getAdUnitPath();
  tr.appendChild(td_adUnitPath);
  td_adUnitPath.appendChild(document.createTextNode(path));

  return table;
}
 