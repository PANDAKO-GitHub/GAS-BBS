# GAS-BBS

Google Apps Script でスレッド式の掲示板を作ってみました。  
Google Apps Script にコピペして、なんやかんや書き換えれば動くんじゃないでしょうか。しらんけど。

## 各ファイルについて
### bbs.gs と index.html と thread.html
3 つで 1 つの Google Apps Script です。  
HTML にはデプロイした Web App の URL を base 要素で設定する必要があります。

### dat.txt
JSON でコメントデータが書き込まれます。  
このファイルの File ID を bbs.gs に直書きします。

## ヤバそうな点
スパムとかイタズラ対策は特にしてないのでザルです。  
セキュリティ的にもなんかあるかもしれません。

## License
MIT っす。
