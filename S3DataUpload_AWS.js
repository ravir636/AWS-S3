'use-strict';
var schedule = require('node-schedule');
var fs = require('fs');
var aws = require('aws-sdk');
var async = require('async');
//var Buffer = require('buffer');
var path = require("path");
aws.config.update({
  accessKeyId: "accesskey",
  secretAccessKey: "secretAccessKey",
   region : "eu-west-1"
  }); 
var s3Bucket = new aws.S3( {
	params: {
		Bucket: "bucketname"
		}
} ); 
var count=1;
var directoryName = '../foldername';
var distFolderPath = path.join(__dirname,directoryName);
var dt = new Date();
var utcDate = dt.toUTCString();
	console.log("starting time is ",utcDate);
console.log(distFolderPath);
//var j = schedule.scheduleJob('0 0 */1 * * * ', function(){ one second
	var j = schedule.scheduleJob('*/1 * * * * ', function(){
var dt = new Date();
var utcDate = dt.toUTCString();
	console.log("count is ",count++,utcDate);
	params1= {Bucket: "bucketname"};
	var filenamelist = [];
var promise1 = new Promise(function (resolve, reject){
		s3Bucket.listObjects(params1, function(err, data){
		//console.log(data);
		var bucketContents = data.Contents;  
		
		async.forEach(bucketContents, function (item, callback){ 
			//console.log(item.Key);
			filenamelist.push(item.Key);
		}, function(err) {
			console.log('iterating done');
		});  
		//console.log('length :',filenamelist.length)	
		resolve(filenamelist);
	}); 
});

promise1.then(function (value){
	//fulfillment 
	console.log('length of array is',filenamelist.length);
	
	fs.readdir(distFolderPath, (err, files) => {
  if(!files || files.length === 0) {
    console.log(`provided folder '${distFolderPath}' is empty or does not exist.`);
   return;
  }
  for (const fileName of files) {

    var filePath = path.join(distFolderPath, fileName);
    //console.log(filenamelist[0]);
	//console.log(filePath);
	//console.log(distFolderPath);
	var flag=0;
	for(var i=0;i<filenamelist.length;i++)
	{	
	//	console.log(filenamelist[i]);
	//	console.log(fileName);
	if(fileName == filenamelist[i])
	{
		
		flag=1;
		console.log("image is same");
		break;
	}
	}
	if(flag==0){
		console.log(fileName);
	fs.readFile(filePath, (error, fileContent) => {
    var params = {
        Key: fileName,
        Body: fileContent,
		ContentEncoding: 'data:image',
        ContentType: 'image/*',
        ACL: 'public-read'
    };
    s3Bucket.putObject(params, function (err, results) {
    if (err) console.error(err);
    //console.log(results);
});
});
	}
  }

});
});
	
	
	
});