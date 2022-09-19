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
