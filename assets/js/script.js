
/*==========================
      functions for creating DOM elements
            ===================================*/
//to create DOM elements
let createElementFunc = function(elementType) {
    return document.createElement(elementType);
}
//to create text node
let createTextContentFunc = function(text) {
    return document.createTextNode(text);
}
//to assign attribute to node elements
let setElementAttribute = function(element, attribute, value) {
    element.setAttribute(attribute, value);
};

let modal = document.getElementById('newsDetail');
let span = document.getElementsByClassName("close")[0];
// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
}
//when the user clicks anywhere outside of the modal, close the modal
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
let request = Ajax_request();
/*==========================
    to dynamically fetching the news from the API
          ===================================*/
(function(){
  request.onreadystatechange = function() {
   if (request.readyState === 4) {  // check if a response was sent back
     if (request.status === 200) {     // check if request was successful
       let news = JSON.parse(request.responseText);
       let newsLength = news.length;
       let readMoreFunc = [];
       let newsSection = document.querySelector('#newsSection');
       //for each news object create a section with h2, image and p
       for(let i = 0; i < newsLength; i++){
         let section = createElementFunc('section');
         setElementAttribute(section,'id','news' + i);
         let heading = createElementFunc('h2');
         heading.appendChild(createTextContentFunc(news[i].title));
         let image = createElementFunc('img');
         //if image is not provided use a placeholder
         if(news[i].image){
           setElementAttribute(image,'src', news[i].image);
         } else{
           setElementAttribute(image,'src', 'assets/images/18.jpg');
         }
         //to display only the snippet of the news (150 characters long)
         let newsSnippet = news[i].body.substring(0, 150);
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
  let url = 'https://cyf-api.herokuapp.com/news';  //server location
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
let readMoreNews = function(i){
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
let url = 'https://cyf-api.herokuapp.com/news'; //server location
request.open('GET', url);                    // adding it to the request
request.setRequestHeader('Accepts', 'application/json'); //header info
request.send();                                 // sending the reque
};

/*==========================
    for validating the form and submitting it
          ===================================*/

let btnSubmit = document.querySelector('#submit');
btnSubmit.addEventListener('click',function(e){
  e.preventDefault();
  let parent = document.querySelector('#apply article.content');

  //if the error is already displayed and the user submits agains
  //remove the previous error and check again
  if(parent.contains(document.querySelector('#errorContainer'))){
    parent.removeChild(document.querySelector('#errorContainer'));
  }
  let fullName = document.querySelector('#fullName');
  let email = document.querySelector('#email');
  let phoneNumber = document.querySelector('#phoneNumber');
  let message = document.querySelector('#message');

  //to hold any error that is identified
  let error = [];
  //validate full name
  if(fullName.value === "")
      error.push("You need to put your full name");
  //validate email address
  if(email.value === "")
      error.push("You need to put your email address");
  else{
    // regular expression to validate if the email address is in a valid format
    let emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //verify the email address and notify success or error
    if (!(emailRegExp.test(email.value))) {
      error.push("The email address "+ email.value + " is not valid");
    }
  }
  //validate phone number
  //if the phone number is not a digit and if it is not empty
  if(isNaN(parseInt(phoneNumber.value)) && phoneNumber.value !== ""){
     error.push('You need to put all digit phone number');
  }else{
      //if the phone number is more/less than 11 digits and if it is not empty
      if(phoneNumber.value.split("").length !== 11 && phoneNumber.value.split("").length !== 0)
            error.push('You should put a eleven digit phone number');
  }
  //validate message content
  if(message.value === ""){
      error.push("You need to put the content of your Message");
  }
//if there is any error in the above validation display error
if(error.length > 1){
  //to inject an error message element to the DOM
  let errorContainer = createElementFunc('div');
  setElementAttribute(errorContainer, 'id', 'errorContainer');

  //to display the error in an ordered list format
  let unorderedList = createElementFunc('ul');
  let inform = createElementFunc('p');
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
          //notify the user with a success message
         alert(response.message +" fantastic !!!, We will get back to you ASAP");
      } else {
        alert('An error occurred during your request: ' +  request.status + ' ' + request.statusText);
      }
    }
  }
  let url = 'https://cyf-api.herokuapp.com/contact';
  request.open('POST', url);
  let applicant = {
    name : fullName.value,
    email : email.value,
    phone : phoneNumber.value,
    message: message.value
  }
  console.log(applicant);
  let param = JSON.stringify(applicant);
  request.setRequestHeader('Content-Type', 'application/json');
  request.send(param);
}
});
