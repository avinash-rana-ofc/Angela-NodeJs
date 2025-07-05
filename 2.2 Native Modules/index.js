const { error } = require("console");
const fs = require("fs");

// fs.writeFile("message.txt", "Just testing from Rana!", (err) => {
//     if(err) throw err;
//     console.log("Hello we have successfully written a test case")
// });


fs.readFile("message.txt","utf8", (err, data) => {
    if(err) throw err;
    console.log(data);
})