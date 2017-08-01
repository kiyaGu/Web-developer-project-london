
/*==========================
      functions creating DOM elements
            ===================================*/
var createElementFunc = function(elementType) {
    return document.createElement(elementType);
}
var createTextContentFunc = function(text) {
    return document.createTextNode(text);
}
var setElementAttribute = function(element, attribute, value) {
    element.setAttribute(attribute, value);
};

var modal = document.getElementById('newsDetail');
var span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

/*==========================
      ajax request
            ===================================*/
  function Ajax_request(){
  if (window.XMLHttpRequest) { // Mozilla, Safari, ...
      xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) { // IE
      try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
           }
      catch (e) {
        try {
          xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
            }
        catch (e) {}
      }//catch
    }//else if
  if (!xmlhttp) {
      alert('Giving up : Cannot create an XMLHTTP instance');
    }
     return xmlhttp;
  }
var request = Ajax_request();
/*==========================
    to dynamically fetching the news from the API
          ===================================*/
(function(){
  request.onreadystatechange = function() {
   if (request.readyState === 4) {  // check if a response was sent back
     if (request.status === 200) {     // check if request was successful
       let news = JSON.parse(request.responseText);
       var newsLength = news.length;
       var readMoreFunc = [];
       let newsSection = document.querySelector('#newsSection');
       for(var i = 0; i < newsLength; i++){
         let section = createElementFunc('section');
         setElementAttribute(section,'id','news' + i);
         let heading = createElementFunc('h2');
         heading.appendChild(createTextContentFunc(news[i].title));
         let image = createElementFunc('img');
         if(news[i].image){
           image.setAttribute('src', news[i].image);
         } else{
           image.setAttribute('src', 'assets/images/18.jpg');
         }
         var newsSnippet = news[i].body.substring(0, 150);
         let content = createElementFunc('p');
         content.appendChild(createTextContentFunc(newsSnippet + " ................ "));
         let button = createElementFunc('button');
         setElementAttribute(button, 'class', 'readMore');
         setElementAttribute(button, 'id', 'btnNews' + i);
         button.appendChild(createTextContentFunc('More'));
         //i will be used for identifying the button from which readMoreNews is initiated
         setElementAttribute(button, 'onclick','readMoreNews(' + i + ')');
         section.appendChild(heading);
         section.appendChild(image);
         section.appendChild(content);
         section.appendChild(button);
         newsSection.appendChild(section);
       }
     } else {
       alert('An error occurred during your request: ' +  request.status + ' ' + request.statusText);
     }
   }
   }
  var url = 'http://cyf-api.herokuapp.com/news';  //server location
  request.open('GET', url);                    // adding it to the request
  request.setRequestHeader('Accepts', 'application/json'); //header info
  request.send();
})();

/*
for showing the detailed news in the news section and to show it only when the
user clicks 'more' button. It also used for the reverse to hide the detailed news when the
user click 'X' button or anywhere on the screen.
*/
/*==========================
    to display the full news in a modal
        ===================================*/
var readMoreNews = function(i){
request.onreadystatechange = function() {
 if (request.readyState === 4) {  // check if a response was sent back
   if (request.status === 200) {     // check if request was successful
     document.querySelector('#newsDetail').style.display = "block";
     let response = JSON.parse(request.responseText);
     document.querySelector('#newsDetailContentHeading').innerHTML = response[i].title;
     document.querySelector('.newsDetailContentP').innerHTML = response[i].body;
     if(response[i].image){
       document.querySelector('#newsDetailContent img').setAttribute("src",response[i].image);
     } else{
       document.querySelector('#newsDetailContent img').setAttribute("src", 'assets/images/18.jpg');
     }
   } else {
     alert('An error occurred during your request: ' +  request.status + ' ' + request.statusText);
   }
 }
 }
var url = 'http://cyf-api.herokuapp.com/news'; //server location
request.open('GET', url);                    // adding it to the request
request.setRequestHeader('Accepts', 'application/json'); //header info
request.send();                                 // sending the reque
};

/*==========================
    for validating the form and submitting it
          ===================================*/

var btnSubmit = document.querySelector('#submit');
btnSubmit.addEventListener('click',function(e){
  e.preventDefault();
  let parent = document.querySelector('#apply article.content');
  if(parent.contains(document.querySelector('#errorContainer'))){
    parent.removeChild(document.querySelector('#errorContainer'));
  }
  var fullName = document.querySelector('#fullName');
  var email = document.querySelector('#email');
  var phoneNumber = document.querySelector('#phoneNumber');
  var message = document.querySelector('#message');
  var error = [];
  //validate full name
  if(fullName.value === "")
      error.push("You need to put your full name");
  //validate email address
  if(email.value === "")
      error.push("You need to put your email address");
  else{
    // regular expression to validate if the email address is in a valid format
    var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //verify the email address and notify success or error
    if (!(emailRegExp.test(email.value))) {
      error.push("The email address "+ email.value + " is not valid");
    }
  }
  //validate phone number
  if(isNaN(parseInt(phoneNumber.value)) && phoneNumber.value !== ""){
     error.push('You need to put all digit phone number');
  }else{
      if(phoneNumber.value.split("").length !== 11 && phoneNumber.value.split("").length !== 0)
            error.push('You should put a eleven digit phone number');
  }
  //validate message content
  if(message.value === ""){
      error.push("You need to put the content of your Message");
  }
//display error
if(error.length > 1){
  //to inject an error message element to the DOM
  var errorContainer = createElementFunc('div');
  setElementAttribute(errorContainer, 'id', 'errorContainer');
  var unorderedList = createElementFunc('ul');

  var inform = createElementFunc('p');
  setElementAttribute(inform, 'id', 'errorHeading');
  inform.appendChild(createTextContentFunc('Please...'));
  //create list entry for each error identified
  error.forEach(function(element){
    let item = createElementFunc('li');
    setElementAttribute(item, 'class', 'error');
    let content = createTextContentFunc(element);
    item.appendChild(content);
    unorderedList.appendChild(item);
  });
  errorContainer.appendChild(inform);
  errorContainer.appendChild(unorderedList);
  parent.appendChild(errorContainer);
} else{
  //if there is no error on the user input
  request.onreadystatechange = function() {
    if (request.readyState === 4) {  // check if a response was sent back
      if (request.status === 200) {     // check if request was successful
          let response = JSON.parse(request.responseText);
         alert(response.message +" fantastic!!!, We will get back to you ASAP");
      } else {
        alert('An error occurred during your request: ' +  request.status + ' ' + request.statusText);
      }
    }
  }
  var url = 'http://cyf-api.herokuapp.com/contact';
  request.open('POST', url);
  var applicant = {
    name : fullName.value,
    email : email.value,
    phone : phoneNumber.value,
    message: message.value
  }
  console.log(applicant);
  var param = JSON.stringify(applicant);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(param);
}
});
