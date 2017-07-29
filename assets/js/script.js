
var createElementFunc = function(elementType) {
    return document.createElement(elementType);
}
var createTextContentFunc = function(text) {
    return document.createTextNode(text);
}
var setElementAttribute = function(element, attribute, value) {
    element.setAttribute(attribute, value);
};

/*
for hidding and showing the detailed news in the news section and to show it only when the
user clicks 'more' button. It also used for the reverse to hide the detailed news when the
user click 'less' button.
*/
var readMore = function(btn){
  var newsDetailProp = window.getComputedStyle(document.querySelector('#newsDetail'),null);
  if(newsDetailProp.getPropertyValue("display") === 'none'){
    //to display the detailed content of the news when the button 'more' is clicked
    document.querySelector('#newsDetail').style.display = "block";
    btn.innerHTML = 'Less';
  } else{
    //to display less content 'higlight' of the news when the button 'less' is clicked
    document.querySelector('#newsDetail').style.display = "none";
    btn.innerHTML = 'More';
  }
}

//for each read 'More' button
var btnReadMoreNews1 = document.querySelector('#btnNews1');
btnReadMoreNews1.addEventListener('click', function(){
  readMore(this);
});
var btnReadMoreNews2 = document.querySelector('#btnNews2');
btnReadMoreNews2.addEventListener('click', function(){
  readMore(this);
});
var btnReadMoreNews3 = document.querySelector('#btnNews3');
btnReadMoreNews3.addEventListener('click', function(){
  readMore(this);
});

//for validating the form
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
  if(fullName.value === "")
      error.push("You need to put your full name");
  if(email.value === "")
      error.push("You need to put your email address");
  else{
    var emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //verify the email address and notify success or error
    if (!(emailRegExp.test(email.value))) {
      error.push("The email address "+ email.value + " is not valid");
    }
  }
  if(message.value === "")
      error.push("You need to put the content of your Message");

  if( isNaN(parseInt(phoneNumber.value)) && phoneNumber.value !== "")
     error.push('You need to put all digit phone number');
  else{
      if(phoneNumber.value.split("").length !== 11 && phoneNumber.value.split("").length !== 0)
            error.push('You should put a eleven digit phone number');
    }

//display error
if(error.length > 1){
  var errorContainer = createElementFunc('div');
  setElementAttribute(errorContainer, 'id', 'errorContainer');
  var unorderedList = createElementFunc('ul');
  var listItems = [];
  var inform = createElementFunc('p');
  setElementAttribute(inform, 'id', 'errorHeading');
  inform.appendChild(createTextContentFunc('Please...'));
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
}
});
