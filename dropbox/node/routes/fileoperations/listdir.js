var fs = require('fs');
var ejs = require('ejs');
var testFolder = './routes/';


var checkFileIsFolder = function (filename){
	try{
		var stats = fs.statSync(filename);
		//console.log('is file ? ' + stats.isFile());
		return !stats.isFile();
	}catch(ex){
		//console.log(ex);
	}
	
	return false;
};

var listdir = function (req,res)
{
	var response = "";
	testFolder = req.param('dir');
	console.log(testFolder);
	fs.readdir(testFolder, function (err, files) 
	{
		console.log(files.length);
		
		for(var i=0;i<files.length;i++)
		{
			//console.log(files[i]);
			if(checkFileIsFolder(testFolder+files[i])){
				response+= " +&nbsp&nbsp ";
			}else{
				response+= "&nbsp&nbsp&nbsp&nbsp&nbsp";
			}
			response += files[i]+"<br>";
			//console.log(files[i]+" is folder :"+checkFileIsFolder(testFolder+files[i]));
		}
		res.send(response);
	});
};



var loadDirPage = function (req,res)
{
	ejs.renderFile('./views/ListDir.ejs',function(err, result) {
		if (!err) {
			res.end(result);
		}
		else {
			res.end('An error occurred');
			console.log(err);
		}
	});
	
	//res.render("ListDir");
	//res.render("index");
};


exports.listdir = listdir;
exports.loadDirPage = loadDirPage;