'use strict';

(function () {

   var profileId = document.querySelector('#profile-id') || null;
   var displayName = document.querySelector('#profile-displayName');
   var apiUrl = appUrl + '/api/user/info';

   function updateHtmlElement (data, element, userProperty) {
      element.innerHTML = data[userProperty];
   }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
      var userObject = JSON.parse(data);
      console.log(data);

      if (userObject.displayName !== null) {
         updateHtmlElement(userObject, displayName, 'displayName');
      } 
   }));
})();
