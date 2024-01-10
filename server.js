const express = require('express');
const bodyParser = require('body-parser');
const midtransClient = require('midtrans-client');

const app = express();
app.use(bodyParser.json());

// Inisialisasi objek Snap dari Midtrans
const snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-L8l3N-OR277Eh9Dq1lTqbKkn',
});

app.use(express.static(__dirname));


// Endpoint untuk mendapatkan token transaksi dari Midtrans
app.post('/get-token', (req, res) => {
    const { name, phoneNumber, membershipType } = req.body;

    const order_id = generateOrderId(name);

    const transaction_details = {
        order_id: order_id,
        gross_amount: calculateGrossAmount(membershipType),
    };

    const parameter = {
        transaction_details: transaction_details,
        credit_card: {
            secure: true,
        },
        customer_details: {
            first_name: name.split(' ')[0],
            last_name: name.split(' ')[1] || '',
            phone: phoneNumber,
        },
    };

    snap.createTransaction(parameter)
        .then((transaction) => {
            const transactionToken = transaction.token;
            console.log('Transaction Token:', transactionToken);
            res.json({ token: transactionToken });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
});

// Fungsi untuk menghitung total harga berdasarkan jenis keanggotaan
function calculateGrossAmount(membershipType) {
    switch (membershipType) {
        case '1 Bulan':
            return 150000;
        case '6 Bulan':
            return 750000;
        case '12+1 Bulan':
            return 1500000;
        default:
            return 0;
    }
}

function generateOrderId(name) {
    if (name && typeof name === 'string') {
        const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const sanitizedName = name.replace(/\s+/g, '_').toLowerCase();
        return `${sanitizedName}_${formattedDate}`;
    } else {
        console.error("Invalid name for order ID");
        return '';
    }
}


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
