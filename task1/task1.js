// const express = require("express")
// const fs = require("fs")
// const PORT = process.env.PORT || 3000;
// const path = require('path')
// const FORM_FILE = path.join(__dirname,'form.json')


// const app = express();
// app.use(express.json());

// app.post('/form',(req,res) => {
//     const formData = req.body;
//     if(!formData.id || !formData.fields) {
//         return res.status(400).json({
//             error : 'Invalid form structure'
//         })
//     }

//     if(fs.existsSync(FORM_FILE))
//     {
//         fs.appendFileSync(FORM_FILE,JSON.stringify(formData,2),'utf-8');
//     }
//     else{
//         fs.writeFileSync(FORM_FILE,JSON.stringify(formData,2),'utf-8');
//     }
    
//     res.status(201).json({
//         message : "Form saved successfully"
//     });
    
//   });



// app.get('/form',(req,res) => {
//     try {
//        if(!fs.existsSync(FORM_FILE))
//        {
//         res.status(404).json({
//             error : "No form data found"
//         })
//        }

//        const formData = fs.readFileSync(FORM_FILE,'utf-8');//NOTE : Here i have used the readFileSync to read the file synchronously instead we can also await this when using readFile using an async function
//        res.status(200).json(JSON.parse(formData))
//     }
//     catch{
//        res.status(500).json({
//         error : 'Internal server error'
//        })
//     }
// })



// app.listen(PORT,() => {
//     console.log(`Server is running on http://localhost:${PORT}`)
// });

const express = require("express");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 3000;
const FORM_FILE = path.join(__dirname, "form.json");

const app = express();
app.use(express.json());

// POST: Save Form Data
app.post("/form", (req, res) => {
    const formData = req.body;

    // Validate the request body
    if (!formData.id || !formData.fields) {
        return res.status(400).json({ error: "Invalid form structure" });
    }

    let existingData = [];

    // Check if form.json exists and read existing data
    if (fs.existsSync(FORM_FILE)) {
        try {
            const fileContent = fs.readFileSync(FORM_FILE, "utf-8").trim();
            if (fileContent) {
                existingData = JSON.parse(fileContent); // Parse JSON content
            }
        } catch (err) {
            return res.status(500).json({ error: "Error reading existing form data" });
        }
    }

    // Ensure existingData is an array
    if (!Array.isArray(existingData)) {
        existingData = [];
    }

    // Append new form data
    existingData.push(formData);

    // Write back updated JSON
    try {
        fs.writeFileSync(FORM_FILE, JSON.stringify(existingData, null, 2), "utf-8");
        res.status(201).json({ message: "Form saved successfully" });
    } catch (err) {
        res.status(500).json({ error: "Error saving form data" });
    }
});

// GET: Retrieve Form Data
app.get("/form", (req, res) => {
    try {
        if (!fs.existsSync(FORM_FILE)) {
            return res.status(404).json({ error: "No form data found" });
        }

        const formData = fs.readFileSync(FORM_FILE, "utf-8");
        res.status(200).json(JSON.parse(formData));
    } catch (err) {
        res.status(500).json({ error: "Internal server error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
