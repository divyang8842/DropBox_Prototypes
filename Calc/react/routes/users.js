var express = require('express');
var router = express.Router();


var users = [
    {
        username: "Mike",
        password: "mike123"
    },
    {
        username: "Tom",
        password: "tom123"
    },
    {
        username: "John",
        password: "john123"
    },
    {
        username: "Mac",
        password: "mac123"
    }
];

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.post('/doLogin', function (req, res, next) {
console.log(req);
    var inputNo1 = req.body.username;
    var inputNo2 = req.body.password;
    var operator=req.body.operation;
    var result;


    switch (operator) {
        case '+':
            if(isNaN(inputNo1) !=true && isNaN(inputNo2) !=true) {
                result = parseFloat(inputNo1) + parseFloat(inputNo2);
                res.status(201).json({
                    message: 'Addition of '+inputNo1+' and '+inputNo2+' is '+result+'',
                    status:'200'
                });         }
            break;

        case '-':
            if(isNaN(inputNo1) !=true && isNaN(inputNo2) !=true) {
                result = parseFloat(inputNo1) - parseFloat(inputNo2);
                res.status(201).json({
                    message: 'Subtraction of '+inputNo1+' and '+inputNo2+' is '+result+'',
                    status:'200'

                });             }
            break;

        case '*':
            if(isNaN(inputNo1) !=true && isNaN(inputNo2) !=true) {
                result = parseFloat(inputNo1) * parseFloat(inputNo2);
                res.status(201).json({
                    message: 'Multiplication of '+inputNo1+' and '+inputNo2+' is '+result+'',
                    status:'200'

                });
            }
            break;

        case '/':
            if(inputNo2==0)
            {
                res.status(201).json({
                    message: ' Cannot Divide By Zero',
                    status:'200'

                });
            }
           else if(isNaN(inputNo1) !=true && isNaN(inputNo2) !=true) {
                result = parseFloat(inputNo1) / parseFloat(inputNo2);
                res.status(201).json({
                    message: 'Division of '+inputNo1+' and '+inputNo2+' is '+result+'',
                    status:'200'

                });             }
            break;
        default:
            result = "Something went wrong..";


    }
    console.log("Result"+ result);

    // Just checking if the username is in our user's array


});

module.exports = router;
