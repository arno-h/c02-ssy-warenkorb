const Axios = require('axios');
const axios = Axios.create({validateStatus: null});

let securityToken = null;

let warenkorb = [
    {"name": "Schuhe", "Menge": 1, "Preis": 49.90, "Gewicht": 640},
    {"name": "Rock", "Menge": 3, "Preis": 29.90, "Gewicht": 1090},
    {"name": "Mütze", "Menge": 1, "Preis": 14.90, "Gewicht": 120},
    {"name": "Strümpfe", "Menge": 2, "Preis": 4.90, "Gewicht": 70}
];

async function calcDiscount() {
    const response = await axios.post(
        'http://localhost:3000/discount/',
        {cart: warenkorb}
    );

    const body = response.data;
    console.log("Summe: " + body.total);
    console.log("Discount: " + body.discount);
    console.log("Gesamtsumme: " + body.final + "\n");

    const response2 = await axios.post(
        'http://localhost:3000/shippingCost/',
        {cart: warenkorb}
    );
    console.log("Versandkosten: " + response2.data);
}

calcDiscount().then();
