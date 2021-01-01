const express=require("express");
const prompt = require('prompt-sync')();
const chalk = require('chalk');
const HashMap = require('hashmap');
global.fileusagemap= new HashMap();
const crudoperations=require('./controller/operations');
const app=express();
const port=process.env.PORT || 8000;

app.listen(port,(err)=>{
        if(err)console.log(err);
       // console.log(`Server is running on port:${port}`);
    })
     for(var i=0;i<5;i++){
        fileusagemap.set(i, false);
    }
console.log(chalk.magentaBright("****Welcome to YourOwnLocalStorage****"));
var flag=false

    do{
        console.log(chalk.yellowBright("What do you want to do? "));
    console.log(chalk.yellowBright("1.) Press 1 for create"));
    console.log(chalk.yellowBright("2.) Press 2 for print"));
    console.log(chalk.yellowBright("3.) Press 3 for delete"));
    console.log(chalk.yellowBright("4.) Press 4 for exit"));
    var number=prompt(chalk.cyan("--Choose an option--"));

      
       switch(number){
           case '1':
                     crudoperations.create();
                     flag=true;
                     break;
           case '2':
                     crudoperations.read();
                     flag=true;
                     break;
            case '3':
                     crudoperations.delete();
                     flag=true;
                      break;
            case '4':
                    flag=false;
                    console.log(chalk.red("Exiting"));
                    break;
                    
                    
           default:
                   console.log(chalk.red("Invalid command!"));
       }
    }while(flag)
    process.exit()





