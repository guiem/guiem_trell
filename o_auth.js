function onOpen(e) {
  var ui = DocumentApp.getUi();
  // Or DocumentApp or FormApp.
  ui.createMenu('Guiem Trell')
      .addItem('Update Tasks', 'updateCards')
      .addSeparator()
      .addItem('Export Tasks', 'exportCards')
      .addToUi();
}

function createTrelloReadings(){
  authorizeToTrello();
  var doc = DocumentApp.getActiveDocument();
  var text = doc.editAsText();
  
  var textLocation = text.findText('<R>');
      
  while (textLocation != null && textLocation.getStartOffset() != -1) {
    textLocation = text.findText('<R>',textLocation);
    boardId = getBoardId('TODOs');
    listId = getListId(boardId,'readings');
    Logger.log(listId);
    cardId = createCard(listId,'manolo','aaa',null);
    //textLocation.getElement().replaceText("<R>", "<R id="+cardId+">");
  }
}

function createCard(listId,name,desc,due){
  authorizeToTrello();
  var requestData = {
    "method": "POST",
    "oAuthServiceName": "trello",
    "oAuthUseToken": "always"
  };
  Logger.log("https://api.trello.com/1/cards?name="+name+"&desc="+desc+"&idList="+listId+"&due="+due);
  var response = UrlFetchApp.fetch("https://api.trello.com/1/cards?name="+name+"&desc="+desc+"&idList="+listId+"&due="+due,requestData);
  Logger.log(response);
}

function getToRead(){
  authorizeToTrello();
  todoId = getTodosId();
  readingsListId = getListId(todoId,'readings');
  toreadCards = getCardsInList(todoId,readingsListId);
}

function getTodosId(){
  return getBoardId("TODOs");
}

function getCardsInList(todoId,listId){
  var requestData = {
    "method": "GET",
    "oAuthServiceName": "trello",
    "oAuthUseToken": "always"
  };
  
  var response = UrlFetchApp.fetch(
      "https://api.trello.com/1/boards/"+todoId+"/cards",
      requestData);
  
  // "idList":"5312f42a3ccd2a4e564a2581"
  
  var cards = JSON.parse((response.getContentText()));
    
  for(var i = 0; i < cards.length; i++) {
    var card = cards[i];
    if (card.idList == listId) {
      Logger.log(card.name);
    }
  }
}

function getListId(boardId,listName){  
  var requestData = {
    "method": "GET",
    "oAuthServiceName": "trello",
    "oAuthUseToken": "always"
  };
  
  var response = UrlFetchApp.fetch(
      "https://api.trello.com/1/boards/"+boardId+"/lists",
      requestData);
    
  var lists = JSON.parse((response.getContentText()));
    
  for(var i = 0; i < lists.length; i++) {
    var list = lists[i];
    if (list.name == listName) {
      return list.id;
    }
  }
}

function getBoardId(boardName){  
  var requestData = {
    "method": "GET",
    "oAuthServiceName": "trello",
    "oAuthUseToken": "always"
  };

  var response = UrlFetchApp.fetch(
      "https://api.trello.com/1/members/me/boards",
      requestData);
    
  var boards = JSON.parse((response.getContentText()));
    
  for(var i = 0; i < boards.length; i++) {
    var board = boards[i];
    if (board.name == boardName) {
      return board.id;
    }
  }
}

function exportCards() {
  authorizeToTrello();
}

function authorizeToTrello() {
  
  
  
  var oauthConfig = UrlFetchApp.addOAuthService("trello");
  oauthConfig.setAccessTokenUrl("https://trello.com/1/OAuthGetAccessToken");
  oauthConfig.setRequestTokenUrl("https://trello.com/1/OAuthGetRequestToken");
  //oauthConfig.setAuthorizationUrl("https://trello.com/1/OAuthAuthorizeToken");
  oauthConfig.setAuthorizationUrl("https://trello.com/1/authorize?scope=read,write");

  
  // Replace these with the values you get from 
  // https://trello.com/1/appKey/generate
  oauthConfig.setConsumerKey("");
  oauthConfig.setConsumerSecret("");
}

