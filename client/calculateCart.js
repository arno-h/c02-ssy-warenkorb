const Axios = require('axios');
const axios = Axios.create({validateStatus: null});

let warenkorb = [
    {"name": "Schuhe", "Menge": 1, "Preis": 49.90, "Gewicht": 640},
    {"name": "Rock", "Menge": 3, "Preis": 29.90, "Gewicht": 1090},
    {"name": "Mütze", "Menge": 1, "Preis": 14.90, "Gewicht": 120},
    {"name": "Strümpfe", "Menge": 2, "Preis": 4.90, "Gewicht": 70}
];

async function calcDiscount() {
    const authUrl = await getServiceUrl('authenticate');
    const authResponse = await axios.post(
        authUrl,
        {
            username: 'Franz',
            password: 'password'
        }
    );
    const securityToken = authResponse.data;

    const discountUrl = await getServiceUrl('discount');
    const response = await axios.post(
        discountUrl,
        {
            cart: warenkorb,
            token: securityToken
        }
    );

    const body = response.data;
    console.log("Summe: " + body.total);
    console.log("Discount: " + body.discount);
    console.log("Gesamtsumme: " + body.final + "\n");

    const shippingCostUrl = await getServiceUrl('shippingCost');
    const response2 = await axios.post(
        shippingCostUrl,
        {
            cart: warenkorb,
            token: securityToken
        }
    );
    console.log("Versandkosten: " + response2.data);
}


async function getServiceUrl(serviceName) {
    const response = await axios.get('http://localhost:3000/routing/' + serviceName);
    return response.data;
}

calcDiscount().then();
