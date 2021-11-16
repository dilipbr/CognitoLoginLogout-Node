const express = require('express');
const router = express.Router();

const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const AWS = require("aws-sdk");

const cognitoISP = new AWS.CognitoIdentityServiceProvider({
  region: 'us-east-2'
});

const ClientId= 'xxxxxxxxxxxxxx';
const UserPoolId='xxxxxxxxxx';

router.post('/login', (req, res)=>{
    
    const poolData = {
        UserPoolId,
        ClientId
    };
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    
    const loginDetails ={
        Username: req.body.userName,
        Password: req.body.password
    };    
    const authenticationDetails= new AmazonCognitoIdentity.AuthenticationDetails(loginDetails);
   
    const userDetails = {
        Username: req.body.userName,
        Pool: userPool
    };
    const cognitoUser = new AmazonCognitoIdentity.CognitoUser(userDetails);

    cognitoUser.authenticateUser(authenticationDetails,{
        onSuccess: data =>{
            res.render('auth',{
                loggedIn: true,
                pageTitle: 'Authenticated',
                token: data.getIdToken().getJwtToken(),
                accessToken: data.getAccessToken().getJwtToken(),
                refreshToken: data.getRefreshToken().getToken(),
                userName: req.body.userName
            });
        },
        onFailure: err =>{
            console.log(err);
            res.render('auth',{
                loggedIn: false,
                pageTitle: 'Login',
                err: err 
            });
        }
    });
});

router.post('/logout', (req, res)=>{

    var token = {
        ClientId,
        Token: req.body.refreshToken
    };
    cognitoISP.revokeToken(token, (err, data) => {
        if (err) {
            res.render('auth', {
                loggedIn: true,
                pageTitle: 'Authenticated',
                err: 'Logout failed ' + err,
                token: '',
                accessToken: '',
                refreshToken: req.body.refreshToken,
                userName: req.body.userName
            });
        } else {
            res.render('auth', {
                loggedIn: false,
                pageTitle: 'Login',
                err: 'Logout Success ' + data
            });
        }
    });
 
});

module.exports=router;