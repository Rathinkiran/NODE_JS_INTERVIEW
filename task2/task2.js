const express = require("express")
const fs = require("fs")
const path = require('path')
const bcrypt = require("bcrypt")


const USERS_FILE = path.join(__dirname,'users.json')

const PORT = process.env.PORT || 4000;
const app = express();
app.use(express.json());

const users =[]

const readUsers = () => {
    try {
        const data = fs.readFileSync(USERS_FILE,'utf-8');
        return data ? JSON.parse(data) : [];
    }
    catch(error){
       return [];
    }
};


const writeUsers = (users) => {
    fs.writeFileSync(USERS_FILE,JSON.stringify(users,null,2),'utf-8')
};


//POST /register - Register a new user
app.post('/register',async (req,res) => {
    const {username , password} = req.body;


    if(!username || !password) 
    {
        return res.status(400).json({
            message : "Username and password are required",
        })
    }

    const users = readUsers();
    if(users.find(user => user.username === username)) {
        return res.status(400).json({
            message : 'User already Exists'
        })
    }

    const hashedPassword = await bcrypt.hash(password,10);
    users.push({username, password : hashedPassword});
    writeUsers(users);

    res.status(201).json({
        message : "User registered successfully"
    })
})




//POST /login - Aunthenticate user
app.post('/login', async (req,res) => {
    const {username , password} = req.body;


    if(!username || !password) 
    {
        return res.status(400).json({
            message : "Username and password are required",
        })
    }

    const users = readUsers();
    const user = users.find(user => user.username === username);

    if(!user || !(await bcrypt.compare(password,user.password)))
    {
       return res.status(401).json({
        message : "Invalid credentials"
       })
    }
     res.status(200).json({
        message : "Login successful"
     })

})

app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`)
});