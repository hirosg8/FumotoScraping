function Notification(date='2023/3/7', message='○') {

const token = 'A03gmJGmrYT5BCakqWT6HxVWF3fspLmSkPbOW26x9L3'
const lineNotifyApi = 'https://notify-api.line.me/api/notify'
  
  message = '\n' + date + ':「' + message + '」' ;
  
  const options =
  {
    "method"  : "post",
    "payload" : {"message": message},
    "headers" : {"Authorization":"Bearer " + token}
  };

  UrlFetchApp.fetch(lineNotifyApi, options);
}
