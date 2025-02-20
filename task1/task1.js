const express = require("express")
const fs = require("fs")
const PORT = process.env.PORT || 3000;
const path = require('path')
const FORM_FILE = path.join(__dirname,'form.json')


const app = express();
app.use(express.json());

app.post('/form',(req,res) => {
    const formData = req.body;
    if(!formData.id || !formData.fields) {
        return res.status(400).json({
            error : 'Invalid form structure'
        })
    }

    fs.writeFileSync(FORM_FILE,JSON.stringify(formData,null,2),'utf-8');
    res.status(201).json({
        message : "Form saved successfully"
    });
    
  });



app.get('/form',(req,res) => {
    try {
       if(!fs.existsSync(FORM_FILE))
       {
        res.status(404).json({
            error : "No form data found"
        })
       }

       const formData = fs.readFileSync(FORM_FILE,'utf-8');//NOTE : Here i have used the readFileSync to read the file synchronously instead we can also await this when using readFile using an async function
       res.status(200).json(JSON.parse(formData))
    }
    catch{
       res.status(500).json({
        error : 'Internal server error'
       })
    }
})



app.listen(PORT,() => {
    console.log(`Server is running on http://localhost:${PORT}`)
});