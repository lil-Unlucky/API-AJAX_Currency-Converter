const cards = document.querySelectorAll('.card');
if (cards.length) {
    const cartIdsList = [];
    const favIdsList = [];
    cards.forEach(card => {
        const cardId = card.dataset.itemid;
        const addToCart = card.querySelector('.add-to-cart-ico');
        const addToFav = card.querySelector('.add-to-fav-ico');

        const cartButtonState = getCookie(`cartButtonState_${cardId}`);
        const favButtonState = getCookie(`favButtonState_${cardId}`);
        if (cartButtonState === 'active') {
            addToCart.classList.add('active');
        }
        if (favButtonState === 'active') {
            addToFav.classList.add('active');
        }

        addToCart.addEventListener('click', () => {
            if (!cartIdsList.includes(cardId)) {
                cartIdsList.push(cardId);
            } else {
                const index = cartIdsList.indexOf(cardId);
                if (index > -1) {
                    cartIdsList.splice(index, 1);
                }
            }
            addToCart.classList.toggle('active');
            document.cookie = `cart=${cartIdsList.join(',')};`;
            document.cookie = `cartButtonState_${cardId}=${addToCart.classList.contains('active')? 'active' : 'inactive'};`;
            console.log(document.cookie);
            console.log(cartIdsList);
        });
        addToFav.addEventListener('click', () => {
            if (!favIdsList.includes(cardId)) {
                favIdsList.push(cardId);
            } else {
                const index = favIdsList.indexOf(cardId);
                if (index > -1) {
                    favIdsList.splice(index, 1);
                }
            }
            addToFav.classList.toggle('active');
            document.cookie = `favorites=${favIdsList.join(',')};`;
            document.cookie = `favButtonState_${cardId}=${addToFav.classList.contains('active')? 'active' : 'inactive'};`;
            console.log(document.cookie);
            console.log(favIdsList);
        });
    });
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

const buttons = document.querySelectorAll('.currency');
const getPrices = document.querySelectorAll('.item-cost');
var currentCurrency = 'RUB';

getPrices.forEach(cost => {
  const originalValue = parseInt(cost.textContent.split(' ')[0]);
  cost.textContent = `${originalValue} ${currentCurrency}`;
});

buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const getCurrency = btn.dataset.currency;

    getPrices.forEach(cost => {
    const originalValue = parseInt(cost.textContent.split(' ')[0]);

        fetch(`https://api.apilayer.com/exchangerates_data/convert?to=${getCurrency}&from=${currentCurrency}&amount=${originalValue}`, {
        method: 'GET',
        redirect: 'follow',
            headers: {
                'apikey': 'f25O5KDwcPWLc2MaeEbY3JTPJZ59stXq'
            },
        })
        .then(response => response.json())
        .then(result => {
            // const newValue = Math.floor(result.result);
            const newValue = result.result.toFixed(2);
            cost.textContent = `${newValue} ${getCurrency}`;
            currentCurrency = getCurrency;
        })
        .catch(error => console.log('::error::', error));
    });
    });
});