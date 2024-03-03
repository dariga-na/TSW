const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      console.error("このブラウザはGeolocation APIをサポートしていません。");
      reject(new Error("Geolocation API is not supported"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // 現在の位置情報が取得できた場合の処理
        const { latitude, longitude } = position.coords;
        console.log("現在の緯度:", latitude);
        console.log("現在の経度:", longitude);
        resolve({ latitude, longitude });
        // ここで取得した位置情報を使って天気情報を取得するなどの処理を行います。
      },
      (error) => {
        reject(error);
        // 位置情報の取得に失敗した場合の処理
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error(
              "ユーザーが位置情報の使用を許可しないというエラーが発生しました。"
            );
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("位置情報が利用できないというエラーが発生しました。");
            break;
          case error.TIMEOUT:
            console.error("位置情報の取得がタイムアウトしました。");
            break;
          case error.UNKNOWN_ERROR:
            console.error("未知のエラーが発生しました。");
            break;
          default:
            console.error("エラーが発生しました。");
            break;
        }
      }
    );
  });
};

export default getCurrentLocation;
