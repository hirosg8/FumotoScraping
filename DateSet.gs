const SPREADSHEET_ID = '10SAqjLTOoGi68xNjCPSE-ov9ZJLvr98AmAJPjem9uFA'

function doPost(e) {
  
  // ユーザーのメッセージを取得
  var userMessage = JSON.parse(e.postData.contents).events[0].message.text;
  //LINEメッセージを「改行」で分割
  var messageParameter = userMessage.split(/\r\n|\n/);

  //対象のスプレッドシートを取得
  var targetSs = SpreadsheetApp.openById(SPREADSHEET_ID);
  //対象のシート取得
  var targetSht = targetSs.getSheetByName('Date');
  //最終行取得
  var lastRow = targetSht.getLastRow();
  //現在年月日取得
  // var date = Utilities.formatDate(new Date(), 'Asia/Tokyo', 'yyyy年MM月dd日');

  //セルに書き込み
  //A列に記入年月日
  targetSht.getRange('A' + (lastRow + 1)).setValue(date);

  return ContentService.createTextOutput(JSON.stringify({'content': 'post ok'})).setMimeType(ContentService.MimeType.JSON);
}
