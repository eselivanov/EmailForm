// 'module.exports' is a node.JS specific feature, it does not work with regular JavaScript
module.exports = 
{
  // This is the function which will be called in the main file, which is server.js
  // The parameters 'name' and 'surname' will be provided inside the function
  // when the function is called in the main file.
  // Example: concatenameNames('John,'Doe');

// disp. http form as persponse
  showForm: function( res ) {
    const fs   = require('fs');
    fs.readFile('form.html', function (err, data) {
        if (err) throw err;
        res.writeHead(200, {
            'Content-Type': 'text/html',
            'Content-Length': data.length
        });
        res.write( data );
        return res.end();     // or    res.end();  what's the difference?
    });
  }


};

// Private variables and functions which will not be accessible outside this file
//var privateFunction = function () 
//{
//};

