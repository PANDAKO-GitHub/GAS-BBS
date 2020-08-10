function doGet(e) {
  
  const html = getHTML(e.parameter.p, e.parameter.t);
  return html.evaluate();
    
}

function doPost(e) {
  
  const id = addDat(e.parameter);
  
  if (id) {
    const html = getHTML("thread", id);
    return html.evaluate();
  } else {
    return HtmlService.createHtmlOutput("えらー");
  }
  
}

function addDat(d) {
  const file = DriveApp.getFileById("1OzhjtRf1_UiRs_z4ff7YnnYukXAb-M-B");
  
  //データ整理
  let type = d.type;
  let thread = d.thread;
  let dat = d.dat;
  let title = d.title;
  let name = d.name;
  let msg = d.msg;
  
  if (!type || !title || !name || !msg) {
    return false;
  }
  
  if (name === "パンダコ") {
    name = "ななし";
  }
  
  //日付
  const now = new Date();
  dat = now.getFullYear() + "/" + ("0" + (now.getMonth() + 1)).slice(-2) + "/" + ("0" + now.getDate()).slice(-2) + " " + ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2);
  
  //type = thread なら ID 生成
  if (type === "thread") {
    thread = now.getTime();
  }
  
  //上書き
  let msgJson = JSON.parse(file.getBlob().getDataAsString());  
  msgJson.unshift({type:type, thread:thread, title:title, dat:dat, name:name, msg:msg});
  file.setContent(JSON.stringify(msgJson));
  
  return thread;
}

function getHTML(p, t) {
  
  //ページ判定
  let page = "index.html";
  if (p === "thread") {
    page = "thread.html";
  }
  
  const html = HtmlService.createTemplateFromFile(page);
  const file = DriveApp.getFileById("1OzhjtRf1_UiRs_z4ff7YnnYukXAb-M-B");
  
  html.msgJson = JSON.parse(file.getBlob().getDataAsString()); 
  html.threadID = t;
  return html;
}
