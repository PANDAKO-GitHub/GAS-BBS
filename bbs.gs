//dat.txt の File ID
const fileID = "【ここに File ID を記入します】";

//【管理用】dat.txt の初期化==============================
function reset() {
  
  const file = DriveApp.getFileById(fileID);
  let m = [];
  m.push({type:"comment", thread:"00000", title:"掲示板を作りました", dat:"2020/08/10 00:00:00", name:"パンダコ", msg:"ちゃんと動くかとても心配😅"});
  m.push({type:"thread", thread:"00000", title:"雑談スレ", dat:"2020/08/10 00:00:00", name:"パンダコ", msg:"雑談用のスレッドです。\n気軽に書き込んでね😉"});
  //ファイル上書き
  file.setContent(JSON.stringify(m));
  
}

//GETのとき==============================
function doGet(e) {
  
  const html = getHTML(e.parameter.p, e.parameter.t);
  return html.evaluate();
  
}

//POSTのとき==============================
function doPost(e) {
  
  const id = addDat(e.parameter);
  
  if (id) {
    const html = getHTML("thread", id);
    return html.evaluate();
  } else {
    return HtmlService.createHtmlOutput("えらー");
  }
  
}

//データ追記処理==============================
function addDat(d) {
  const file = DriveApp.getFileById(fileID);
  
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
    
  //日付
  const now = new Date();
  dat = now.getFullYear() + "/" + ("0" + (now.getMonth() + 1)).slice(-2) + "/" + ("0" + now.getDate()).slice(-2) + " " + ("0" + now.getHours()).slice(-2) + ":" + ("0" + now.getMinutes()).slice(-2) + ":" + ("0" + now.getSeconds()).slice(-2);
  
  //type = thread なら ID 生成
  if (type === "thread") {
    thread = now.getTime().toString();
  }
  
  //データ取得
  let msgJson = JSON.parse(file.getBlob().getDataAsString()); 
  
  //type != thread （つまり comment）ならアゲ
  if (type != "thread") {
    //thread のデータを取得
    const t = msgJson.find(v => (v.thread === thread && v.type === "thread"));
    if (t) {
      //thread を削除して先頭に追加
      msgJson = msgJson.filter(v => !(v.thread === thread && v.type === "thread"));
      msgJson.unshift(t);
    }
  }
  
  //上書き 
  msgJson.unshift({type:type, thread:thread, title:title, dat:dat, name:name, msg:msg});
  file.setContent(JSON.stringify(msgJson));
  
  return thread;
}

//出力 HTML の取得==============================
function getHTML(p, t) {
  
  //ページ判定
  let page = "index.html";
  if (p === "thread") {
    page = "thread.html";
  }
  
  const html = HtmlService.createTemplateFromFile(page);
  const file = DriveApp.getFileById(fileID);
  
  html.msgJson = JSON.parse(file.getBlob().getDataAsString()); 
  html.threadID = t;
  return html;
}

//最終コメントの取得==============================
function getLastMsg(id) {
  const file = DriveApp.getFileById(fileID);
  //データ取得
  let msgJson = JSON.parse(file.getBlob().getDataAsString()); 
  //当該 thread の最新データを取得
  const t = msgJson.find(v => v.thread === id);
  //出力整形
  if (t) {
    return t.name + "｜" + t.dat + "｜" + t.msg.substr(0,10) + "...";
  } else {
    return "";
  }
}
