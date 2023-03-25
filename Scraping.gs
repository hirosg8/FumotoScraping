function FumotoScraping(){

 //Script Propertyを読み込む
 const targetUrl = PropertiesService.getScriptProperties().getProperty('TARGET_URL');
 const spreadSheetID = PropertiesService.getScriptProperties().getProperty('SPSHEET_ID');
 const spreadSheetName = PropertiesService.getScriptProperties().getProperty('SPSHEET_NAME');
 const extractionRangeFrom = PropertiesService.getScriptProperties().getProperty('EXTRACTION_RANGE_FROM');
 const extractionRangeTo = PropertiesService.getScriptProperties().getProperty('EXTRACTION_RANGE_TO');
 //const getRangeFrom = PropertiesService.getScriptProperties().getProperty('GET_RANGE_FROM');
 //const getRangeTo = PropertiesService.getScriptProperties().getProperty('GET_RANGE_TO');

 //スプレッドシートのIDを指定
 const spreadSheet = SpreadsheetApp.openById(spreadSheetID)

 //スプレッドシートのシート名を指定
 const sheet = spreadSheet.getSheetByName(spreadSheetName)

 //シートのA列を削除
 let lastRow = sheet.getMaxRows();
 sheet.getRange(1,1,lastRow,1).clearContent();

 //シートの最終列を取得
 let targetRow = sheet.getLastRow() + 1;

 //HTMLの読み込み
 let html = PhantomJSCloudScraping(targetUrl);

 //Parserライブラリ発動*from~toでスクリプトの抽出範囲を指定する
 let contentBlocks = Parser.data(html).from(extractionRangeFrom).to(extractionRangeTo).iterate();
 let contentBlock = contentBlocks[1];

 //スプレッドシートの日付を取得
 const today = new Date();
 const todayMonth = today.getMonth() + 1; //月
 const st = spreadSheet.getSheetByName('Date');
 let getDates = st.getDataRange().getValues()
 for (let i = 0; i < getDates.length; i++) {
  //取得した日付ごとに処理する
  let date = new Date(getDates[i]);
  let year = date.getFullYear();
  let month = date.getMonth()+1;
  let day = date.getDate();
  let monthDiff = month - todayMonth;
  let targetNumber;
  switch (monthDiff) {
    case 0:
     //差異が無い場合
     targetNumber = day + 1;
     break;
    case 1:
     //1ヶ月分の差異がある場合
     targetNumber = day + 31 + 1;
     break;
    case 2:
     //2ヶ月分の差異がある場合
     targetNumber = day + 31 + 30 + 1;
     break;
    case 3:
     //3ヶ月分の差異がある場合
     targetNumber = day + 31 + 30 + 31 + 1;
     break;
    default:
     //例外
     console.log('月の差異で異常値が検出されました');
  }
  //Parserライブラリ発動*from~toでスクリプトの抽出範囲を指定する
  console.log('targetNumber: ' + targetNumber);
  console.log('contentBlock: ' + contentBlock);
  let myRegexp = new RegExp('<td rowspan="1" colspan="1" class="el-table_1_column_' + targetNumber + '[\\s\\S]*?</td>');
  console.log('myRegexp: ' + myRegexp);
  let targetBlock = contentBlock.match(myRegexp);
  console.log('targetBlock: ' + targetBlock[0]);
  let myRegexp2 = new RegExp('ー|〇|△|×');
  console.log('myRegexp2: ' + myRegexp2);
  let freeDate = targetBlock[0].match(myRegexp2);
  console.log('freeDate: ' + freeDate);
  //シートに取得した情報を追加
  sheet.getRange("A" + targetRow).setValue(freeDate[0]);
  //次の行に移動
  targetRow++
 }
}

function PhantomJSCloudScraping(URL) {
 
 //Script Propertyを読み込む
 const phjsApiKey = PropertiesService.getScriptProperties().getProperty('PHJS_API_KEY');
 const renderType = PropertiesService.getScriptProperties().getProperty('RENDER_TYPE');
 const phjsUrl = PropertiesService.getScriptProperties().getProperty('PHJS_URL');
 const phjsUrlReq = PropertiesService.getScriptProperties().getProperty('PHJS_URL_REQUEST');
 
 let apiKey = phjsApiKey;
 let option =
 {url:URL,
 renderType:renderType,
 outputAsJson:true,
 };

 let payload = JSON.stringify(option); 
 payload = encodeURIComponent(payload);
 let apiUrl = phjsUrl + apiKey + phjsUrlReq + payload;
 let response = UrlFetchApp.fetch(apiUrl);
 let json = JSON.parse(response.getContentText());
 let source = json["content"]["data"];
 return source;
}