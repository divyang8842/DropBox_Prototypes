
//gender constants
var MALE = 1;
var FEMALE = 2;
var OTHER = 0;
//End


var getGender = function(gender){
	gender = parseInt(gender);
	if(gender===MALE){
		return "Male";
	}else if(gender===FEMALE){
		return "Female";
	}else {
		return "Other";
	}
};

var gtDateStringFromObject = function(dateObj,format,separator){
	var date = new Date(dateObj);
	if(!separator){
		separator = "/";
	}
	if(format==="MMDDYYYY"){
		return (date.getMonth()+1)+separator+date.getDate()+separator+date.getFullYear();
	}else if(format==="YYYYMMDD"){
		return date.getFullYear()+separator+date.getMonth()+separator+date.getDate();
	}
	
};

var shareFile = function(emailId){

    console.log(emailId);
};




exports.gtDateStringFromObject=gtDateStringFromObject;
exports.getGender=getGender;

