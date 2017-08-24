/* eslint no-console: 0 */

/*
References, credits:
https://www.sitepoint.com/creating-and-handling-forms-in-node-js/
*/

'use strict';

const http = require('http');
const fs   = require('fs');
const util = require('util');

// external modules to load:
const formidable = require('formidable');  
const nodemailer = require('nodemailer');  

// http server 
var port = '8080';
var ws = http.createServer( (req, res) => {        
    // disp. http form as persponse or parse results upon form submission
    if (req.method.toLowerCase() == 'get') {
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post' || req.url == '/sendemail') {
    //processAllFieldsOfTheForm(req, res);
        processFormFieldsIndividual(req, res);
    }
});


// disp. http form as persponse
function displayForm( res ) {
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

// parse results upon form submission - altogether at once
/*
function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, (err, fields, files) => {
        if (err) throw err;
        //Store the data from the fields in your data store.
        //The data store could be a file or database or any other store based
        //on your application.

        var from     = fields.from;
        var to       = fields.to;
        var body     = fields.body;
        var filepath = files.filetoupload.path;
        //      var newpath  = 'C:/<..path..>/' + files.filetoupload.name;

        res.writeHead(200, {
            'content-type': 'text/plain'
        });


        res.write('received the data:\n\n');
        res.write(util.inspect({
            fields : fields,
            files  : files
        }));

        //      fs.rename(oldpath, newpath, (err) => {  
        //        if (err) throw err;
        //        res.write('<html><body>');
        //        res.write('<br />Email sent!');   

        res.write('\n');
        res.write(`This is a file < ${files.filetoupload.name} > uploaded!!!!`);

        ////        res.write(`<br />as: ${newpath}`);
        //        res.write('</body></html>');
        res.end();
        ////      });

    });
}
*/

function processFormFieldsIndividual(req, res) {
    //Store the data from the fields in your data store.
    //The data store could be a file or database or any other store based
    //on your application.
    var fields = [];
    var form = new formidable.IncomingForm();
    //Call back when each field in the form is parsed.
    form.on('field', function (field, value) {
        //console.log(field);
        //console.log(value);
        fields[field] = value;
    });
    //Call back when each file in the form is parsed.
    form.on('file', function (name, file) {
        //console.log(name);
        //console.log(file);
        fields[name] = file;
        //Storing the files meta in fields array.
        //Depending on the application you can process it accordingly.
    });

    //Call back for file upload progress.
    form.on('progress', function (bytesReceived, bytesExpected) {
        var progress = {
            type: 'progress',
            bytesReceived: bytesReceived,
            bytesExpected: bytesExpected
        };
        console.log(progress);
        //Logging the progress on console.
        //Depending on your application you can either send the progress to client
        //for some visual feedback or perform some other operation.
    });

    //Call back at the end of the form.
    form.on('end', function () {
        res.writeHead(200, {
            'content-type': 'text/plain'
        });

        //--------------------------------------------------------  
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields
        }));

        //call function to send email; pass 'fields' object to it 
        sendEmail(fields); 

        //if emailSendStatus {
        //  console.log( emailSendStatus );         
        //} else {
        //  console.log('Error sending email');  
        //};

    });
    form.parse(req);
}



//Send emial using nodemailer module
//todo: read settings from file ..
function sendEmail(fields, stat) {
  var transporter = nodemailer.createTransport({
      service : 'gmail',
      auth    : {
          user  : 'wyz@gmail.com',
          pass  : '**************' // put your password here ..
      }
  });

  var mailOptions = {
      from    : fields.from,
      to      : fields.to,
      subject : 'Sending email via EmailForm.js',
      text    : fields.body

  };

  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
          console.log( error.message );
          return( error.messageId );
      }
          
      console.log('Email sent: ' + info.response);  
      //return(info.response);

      //console.log( info );
      //{ 
      //  accepted: [ 'xyzv@gmail.com' ],
      //  rejected: [],
      //  response: '250 2.0.0 OK 1503414947 h21sm10188817qta.58 - gsmtp',
      //  envelope: { 
      //    from: 'xyz@gmail.com', 
      //    to: [ 'xyz@gmail.com' ] 
      //  },
      //  messageId: '<29485252-dd3e-fc39-9920-50436443d636@gmail.com>' 
      //}
  });

}


// Run the http server
ws.listen( port ); 
console.log('server listening on ' + port);
