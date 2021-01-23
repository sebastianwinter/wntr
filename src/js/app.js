import '../scss/app.scss';
//import Prismic from '@prismicio/client';
import Prismic from 'prismic-javascript';

// Your JS Code goes here
document.querySelector('p').innerHTML = "app.js says hello :)"

//var Prismic = require('prismic-javascript');
 
Prismic.api("http://wntr.prismic.io/api", function(error, api) {
  var options = {req : req}; // In Node.js, pass the request as 'req' to read the reference from the cookies
  api.query("", options, function(err, response) { // An empty query will return all the documents
    if (err) {
      console.log("Something went wrong: ", err);
    }
    console.log("Documents: ", response.documents);
  });
});;