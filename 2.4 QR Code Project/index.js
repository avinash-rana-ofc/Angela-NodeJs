/* 
1. Use the inquirer npm package to get user input.
2. Use the qr-image npm package to turn the user entered URL into a QR code image.
3. Create a txt file to save the user input using the native fs node module.
*/
import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs"

inquirer
  .prompt([
    /* Pass your questions in here */
    { name: "askName", message: "What is your name?" },
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
    console.log("My answer is ", answers.askName);
    const qrImageGenerate = qr.image(answers.askName, {type : "png"})
    qrImageGenerate.pipe(fs.createWriteStream("qr_image_"+answers.askName+".png"))
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      console.log("Please check question", error);
    } else {
      // Something else went wrong
      console.log("Error found", error);
    }
  });
