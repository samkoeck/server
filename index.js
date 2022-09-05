const bodyParser = require('body-parser');
const fs = require('fs');
const express = require('express');
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


const returnedDataJson = () => {
    return JSON.parse(fs.readFileSync('./data/guests.json'));
}

async function writePersonJson(userJson) {
    fs.writeFileSync('./data/guests.json', JSON.stringify(userJson));
}

// krijgt een json binnen met 3 velden naam, voornaam en telefoonnummer. De telefoonnummer is de primary key in de data.json
app.post('/addPerson', async (req, res) => {
    const dataAsJson = returnedDataJson();
    const item = dataAsJson.findIndex(item => item.phoneNumber === req.body.phoneNumber);
    if (item >= 0) {
        res.status(401).send({
            'msg': 'userAlreadyExists'
        });
    } else {
        const userData = req.body;

        dataAsJson.push(userData);

        writePersonJson(dataAsJson);

        const msg = "personAdded";

        res.status(200).send({
            msg
        });
    }
});

// returns all guests on the list
app.get('/getGuests', async (req, res) => {
    const dataAsJson = returnedDataJson();
    res.status(200).send(dataAsJson);

});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});