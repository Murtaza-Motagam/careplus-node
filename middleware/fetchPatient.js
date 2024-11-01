const  jwt = require('jsonwebtoken');
const JWT_SECRET = 'UserIsValidated';


const fetchPatient = (req, res, next) => {
    const token = req.header('Authorization');

    if(!token){
        res.status(401).send({error: "Please authenticate using valid token"});
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.patient = data.patient;
        next();    
    } 
    catch (error) {
        res.status(401).send({error: "Please authenticate using valid token"});
    }
}



module.exports = fetchPatient;