const app = require('./app');

const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken')

// global token, since we dont have any database, I did not go complex. I simply created a global token that program checks and compare with it.
// Login endpoint creates the token, then verifyToken middleware verifies the token with the taken token in req.body
var token;

// database
const initial_db = [
    {
        id: 1,
        title: "FED's product",
        price: 200.5,
        description: 'Very special product. Limited in stocks. DO NOT MISS IT!',
        category: 'electronic'
    },
]



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type"
    );
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080")
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
      return res.status(200).json({});
    }
    next();
});

// jwt verify 
const verifyToken = (req, res, next) => {

    const tokenNew = req.body.token || req.headers["x-access-token"];
    if(!tokenNew) {
        return res.status(403).send("No token");
    }
    try{
        const decode = jwt.verify(tokenNew, "12312dasddasdqwewqeqwesadasd");
        req.user = decode;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
}

// create token
app.get('/login', (req, res) => {
    token = jwt.sign({
        id: 1 
    }, "12312dasddasdqwewqeqwesadasd", {
        expiresIn: "2h",
    })
    res.status(201).json(token);
})


app.get('/', (req, res) => {
    res.send('Hello, welcome');
});

// API GET, get all products
app.get('/productsAPI', (req, res) => {
    res.status(200).json(initial_db);
})

// API GET, get one product
app.get('/productsAPI/:id', (req, res) => {
    try {
        for (const productItem of initial_db) {
            if(productItem.id == req.params.id){
                res.status(200).json(productItem);
            }
        }
    } catch (err) {
        res.status(400).json({
            title: "Couldnt add the product",
            error: err
        })
    }
    
})

// API POST, creating new product and adding it into database
app.post('/productsAPI', verifyToken, (req, res) => {
    req.body.id = (initial_db.length >= 1 ? initial_db[initial_db.length-1].id + 1 : 1);   // manually increment id
    try {
        initial_db.push(req.body);
        res.status(201).send(initial_db[initial_db.length-1]);
    } catch (err) {
        res.status(400).json({
            title: "Couldnt add the product",
            error: err
        })
    }
})

// API PATCH, Updates taken id in database
app.patch('/productsAPI/:id', verifyToken, (req, res) => {
    try {
        for (let i=0; i<initial_db.length;i++) {  // searching the id
            if(req.params.id == initial_db[i].id){
                initial_db[i].category = req.body.category;
                initial_db[i].description = req.body.description;
                initial_db[i].price = req.body.price;
                initial_db[i].title = req.body.title;
                res.status(201).send(initial_db[initial_db.length-1]);
            }
        }
    } catch (err) {         // no id is found
        res.status(400).json({
            title: "Couldnt update the product",
            error: err
        })
    }
})

// API PUT, Updates taken id in database. If it is not exist, then add the data.
app.put('/productsAPI/:id', verifyToken, (req, res) => {
    try {
        for (let i=0; i<initial_db.length;i++) {        // searching proper data
            if(req.params.id == initial_db[i].id){
                initial_db[i].category = req.body.category;
                initial_db[i].description = req.body.description;
                initial_db[i].price = req.body.price;
                initial_db[i].title = req.body.title;
                res.status(201).send(initial_db[initial_db.length-1]);
            }
        }
        if(i == initial_db.length){         // data is not exists, add
            req.body.id = (initial_db.length >= 1 ? initial_db[initial_db.length-1].id + 1 : 1);  
            initial_db.push(req.body);
            res.status(201).send(initial_db[initial_db.length-1]);
        }
    } catch (err) {             // something went wrong
        res.status(400).json({
            title: "Couldnt update the product",
            error: err
        })
    }
})


// API DELETE, Deletes a product in database
app.delete('/productsAPI/:id', verifyToken, (req, res) => {
    try {
        for (let i=0; i<initial_db.length;i++) {         // searching the data
            if(req.params.id == initial_db[i].id){
                var deleted = initial_db.splice(i, 1);
                res.status(200).json(deleted);
            }
        }
    } catch (err) {
        res.status(400).json({
            title: "Couldnt delete the product",
            error: err
        })
    }
})




const PORT = 8080;


const server = app.listen(8080, () => {
    console.log(`server listening and starting at port: 8080`);
});

