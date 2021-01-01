const fs = require('fs');
var prompt = require('prompt-sync')();
const chalk = require('chalk');
const error = chalk.bold.red;
const success=chalk.bold.green;
const cyan=chalk.bold.cyan;
var HashMap = require('hashmap');

var fileusagemap = new HashMap();
var keystoragemap=new HashMap();
global.gpath="";
const crudoperations={
     getHash(input){
        var hash = 0, len = input.length;
        for (var i = 0; i < len; i++) {
          hash  = ((hash << 5) - hash) + input.charCodeAt(i);
          hash |= 0; // to 32bit integer

        }
        return hash%5;
      },
    create(){
        var Path = prompt(cyan('Enter your path or press enter d for default path'));
        //console.log(Path);
    
    
        if(Path=='d'){
            Path = "C:/Users/LENOVO/Desktop/";
           
        }
        gpath=Path;
        console.log(' Path is : ' + Path);
      
        var Key= prompt(cyan('Enter key '));
            console.log("Key "+Key)
            while( Key.length>32 ){ //32 chars
              
                Key= prompt(error('Key should be of less than or equal to 32 characters, Enter new valid key'));
            console.log("Key "+Key)
            }
            while( keystoragemap.get(Key)!=null){
               
                Key= prompt(error('Key already exists, Enter new valid key or press e for exit'));
                if(Key=='e'){
                    return;
                }
                if(Key!='e') console.log("Key "+Key)
            }
       
       
         const path = Path + "file" + crudoperations.getHash(Key) + ".json";
        var Value = prompt(cyan('Enter Value '));
        console.log("Value "+Value);
        const size = new TextEncoder().encode(JSON.stringify(Value)).length
      
        const kiloBytes = size / 1024;
    
    
        while(kiloBytes > 16){  //16KB
            if(Value=='e'){
                return;
            }
           Value=prompt(error("Value should less than or equal to 16KB, Enter new Valid Value or press e for exit"));
         
        }
        var ttl=prompt(cyan("Enter ttl in seconds or press d for default"));
        if(ttl=='d'){
            ttl=-1;
        }
        if(ttl!=-1)console.log("ttl is"+ttl);
        var ts=Date.now();
        var creationTime=Math.floor(ts/1000);
        if((fileusagemap.get(crudoperations.getHash(Key)))==true){
            console.log(error("Process can't be completed.File is already in use.Try again later!"));
            console.log(cyan("Exiting"));
                    process.exit()
        }
        fileusagemap.set(crudoperations.getHash(Key),true);//file in use now
            let newkeydata = { 
            "key" : Key,
            "value" : Value,
            "ttl" : ttl,
            "creationTime" : creationTime,
        };
        console.log(newkeydata);
        try{
            if (fs.existsSync(path)) {
               
                let rawdata = fs.readFileSync(path);
                let filedata = JSON.parse(rawdata);
         
var totalkeys= Object.keys(filedata).length;
var  individualkeysize = new TextEncoder().encode(JSON.stringify(filedata[0])).length
var sizeoffile=((individualkeysize*totalkeys*1.0 )/(1024*1000000));
console.log(sizeoffile);
if(sizeoffile>=1){ //1GB
console.log(error("Key can't be created.File storage is exceeding 1GB,Try deleting some keys "));
return;
}

               
                filedata.push(newkeydata);
                let newFileData = JSON.stringify(filedata);
                fs.writeFileSync(path, newFileData);
            
                keystoragemap.set(newkeydata.key, newkeydata); //key-value set in hashmap
                console.log(success("Key Created successfully ,key "+newkeydata.key+" value "+newkeydata.value));
                // for (const pair of fileusagemap) {
                //     console.log(`${pair.key} : ${pair.value}`)
                // }
                // console.log("----------------")
                // for (const pair of keystoragemap) {
                //     console.log(`${pair.key} : ${pair.value}`)
                // }
                // console.log("----------------")
                // fileusagemap.set(crudoperations.getHash(Key),false); //file not in use now
                // for (const pair of fileusagemap) {
                //     console.log(`${pair.key} : ${pair.value}`)
                // }
               
                
            }
            else{
              
                 
                let filedata = [];
                filedata.push(newkeydata);
                let newFileData= JSON.stringify(filedata);
                fs.writeFileSync(path, newFileData);
                keystoragemap.set(newkeydata.key, newkeydata);//key-value set in hashmap
           
                console.log(success("Key Created successfully ,key "+newkeydata.key+" value "+newkeydata.value));
                // for (const pair of fileusagemap) {
                //     console.log(`${pair.key} : ${pair.value}`)
                // }
                // console.log("----------------")
                // for (const pair of keystoragemap) {
                //     console.log(`${pair.key} : ${pair.value}`)
                // }
                // console.log("----------------")
                // fileusagemap.set(crudoperations.getHash(Key),false);//file not in use now
                // for (const pair of fileusagemap) {
                //     console.log(`${pair.key} : ${pair.value}`)
                // }
                
            }
        }
        catch(error){
            console.log(error);
            fileusagemap.set(crudoperations.getHash(Key),false);//file not in use now
            
    
        }
    
    
       
    },
    delete(){
        var Key= prompt(cyan('Enter key'));
        console.log("Key "+Key)
        while(Key.length>32){ //32 chars
            Key= prompt(error('Key should be of less than or equal to 32 characters, Enter new valid key or press e for exit'));
            if(Key=='e'){
                return;
            }
            if(Key!='e') console.log("Key "+Key)
        }
        while( keystoragemap.get(Key)==null){
            if(Key=='e'){
                return;
            }
            Key= prompt(error('Key does not exists or is expired, Enter valid key or press e for exit'));
            if(Key=='e'){
                return;
            }
            if(Key!='e')console.log("Key "+Key)
        }
        fileusagemap.set(crudoperations.getHash(Key),true);//file in use now
        const path = gpath + "file" + crudoperations.getHash(Key) + ".json";
        let rawdata = fs.readFileSync(path);
        let filedata = JSON.parse(rawdata);

        if((keystoragemap.get(Key).ttl === -1) || (((Date.now()/1000)-keystoragemap.get(Key).creationTime) < keystoragemap.get(Key).ttl)){
           
            for( var i = 0; i < filedata.length; i++){ 
    
                if ( filedata[i].key == Key) { 
            
                    filedata.splice(i, 1); 
                }
            
            }
        
            keystoragemap.delete(Key);
            let newFileData = JSON.stringify(filedata);
            fs.writeFileSync(path, newFileData);
          
            console.log(success("Key deleted successfully."))
        }
        else{
            keystoragemap.delete(Key);
            console.log(error("Sorry,Key is expired."))
        }

       
       
        fileusagemap.set(crudoperations.getHash(Key),false);//file not in use now

    },
    read(){
        var Key= prompt('Enter key');
            console.log("Key "+Key)
            while(Key.length>32){ //32 chars
                if(Key=='e'){
                    return;
                }
                Key= prompt(error('Key should be of less than or equal to 32 characters, Enter new valid key or press e for exit'));
                console.log("Key "+Key)
            }
            while( keystoragemap.get(Key)==null){
                if(Key=='e'){
                    return;
                }
                Key= prompt(error('Key does not exists, Enter valid key or press e for exit'));
                console.log("Key "+Key)
            }
            fileusagemap.set(crudoperations.getHash(Key),true);//file in use now
            if((keystoragemap.get(Key).ttl === -1) || (((Date.now()/1000)-keystoragemap.get(Key).creationTime) < keystoragemap.get(Key).ttl)){
                console.log("Key : "+Key+", Value : "+keystoragemap.get(Key).value)
            }
            else{
                keystoragemap.delete(Key);
                console.log(error("Sorry,Key is expired."))
            }
            
            fileusagemap.set(crudoperations.getHash(Key),false);//file not in use now
    }
}


module.exports = crudoperations;
