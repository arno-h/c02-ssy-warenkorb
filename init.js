const Axios = require('axios');
const axios = Axios.create({validateStatus: null});

/* init()
 * Diese Funktion wird direkt nach dem Server-Start automatisch aufgerufen.
 * Sie kann dazu benützt werden, Services zu konfigurieren.
 */
async function init() {
    // Service registrieren; Antwort auswerten ersparen wir uns
    await axios.post(
        'http://localhost:3000/routing/',
        {
            name: 'discount',
            url: 'http://localhost:3000/discount/'
        }
    );
    await axios.post(
        'http://localhost:3000/routing/',
        {
            name: 'shippingCost',
            url: 'http://localhost:3000/shippingCost/'
        }
    );
    await axios.post(
        'http://localhost:3000/routing/',
        {
            name: 'authenticate',
            url: 'http://localhost:3000/authenticate/'
        }
    );
}

module.exports = init;
