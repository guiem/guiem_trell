function authorizeToTrello() {
  var oauthConfig = UrlFetchApp.addOAuthService("trello");
  oauthConfig.setAccessTokenUrl("https://trello.com/1/OAuthGetAccessToken");
  oauthConfig.setRequestTokenUrl("https://trello.com/1/OAuthGetRequestToken");
  oauthConfig.setAuthorizationUrl("https://trello.com/1/OAuthAuthorizeToken");

  // Replace these with the values you get from 
  // https://trello.com/1/appKey/generate
  oauthConfig.setConsumerKey("Consumer Key");
  oauthConfig.setConsumerSecret("Consumer Secret");

  var requestData = {
    "method": "GET",
    "oAuthServiceName": "trello",
    "oAuthUseToken": "always"
  };

  var result = UrlFetchApp.fetch(
      "https://api.trello.com/1/members/me/boards",
      requestData);

  Logger.log(result.getContentText());
}
