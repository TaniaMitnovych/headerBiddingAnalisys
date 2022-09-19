
function injectStylesForParentDocument() {
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
        table{
          width:90%;
        }
        td{
          border:1px solid #000000;
          padding:10px;
        }
  `
  let iframe=document.getElementById("iframe__header-bidding-analisys");
  iframe.contentWindow.document.head.appendChild(style);
}