let currentImageIndex = 0;

function changeImage() {
    const carouselImages = document.getElementsByClassName('carousel-image');
    carouselImages[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
    carouselImages[currentImageIndex].classList.add('active');
}

setInterval(changeImage, 3000);

function initCarousel() {
    const carouselImages = document.getElementsByClassName('carousel-image');
    carouselImages[0].classList.add('active');
}

initCarousel();

// Form daftar button

function daftar() {
    var content4 = document.getElementsByClassName("content-4")[0];
    content4.scrollIntoView({behavior: "smooth"});
}

// Midtrans

function handlePayment() {
    getTransactionToken();
}

// Fungsi untuk mendapatkan token dari server
function getTransactionToken() {
    fetch('/get-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: document.getElementById('name').value,
            phoneNumber: document.getElementById('notlp').value,
            membershipType: document.getElementById('dropitem').value,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
            if (data.token) {
                // Jika berhasil mendapatkan token, buka pop-up pembayaran Snap
                window.snap.pay(data.token);
            } else {
                console.error('Error getting transaction token');
            }
        })
        .catch((error) => {
            console.error(error);
        });
}

var payButton = document.getElementById('pay-button');
payButton.addEventListener('click', function () {
    handlePayment();
});