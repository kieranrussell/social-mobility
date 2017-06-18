State.add('/home', function () {
}).add('/contact', function () {
    contactCtrl();
}).add('/products', function () {
    productsCtrl();
});

changeState('/home');
var view = undefined;

function updateActive() {
    State.getStates().filter(function (state) {
        return state.name !== State.getCurrent();
    }).map(function (state) {
        return state.name.replace('/', '');
    }).forEach(function (state) {
        var link = document.getElementById(state + '-link');
        link.classList.remove('active');
    });
    var currentState = State.getCurrent().replace('/', '');
    var link = document.getElementById(currentState + '-link');
    link.classList.add('active');
}

function changeState(toState) {
    State.navigate(toState);
    updateActive();
}

function productsCtrl() {
    var productListHtml = document.getElementById('saved-products-list');
    var savedProductList = JSON.parse(localStorage.getItem('product-list')) || [];
    renderSavedProducts();

    getProductsData().then(function (products) {
        var displayProducts = document.getElementById('products-list');
        products.forEach(function (product) {
            displayProducts.innerHTML += '<div class="column">' +
                '<h3>' + product.name + '</h3>' +
                '<p>' + product.description + '</p>' +
                '<button onclick="view.addToSavedProducts(\'' + product.name + '\')">Add</button>' +
                '</div>'
        });
    }).catch(function () {

    });

    function renderSavedProducts() {
        productListHtml.innerHTML = '';
        savedProductList.forEach(function (product, index, array) {
            productListHtml.innerHTML += '<li>' + String(product) + '<a onclick="view.deleteFromSavedProducts(' + String(index) + ')">(Delete)</a></li>'
        });
    }

    function deleteFromSavedProducts(index) {
        if (confirm('Are you sure you want to delete ' + savedProductList[index] + ' from your basket?') == true) {
            savedProductList.splice(index, 1);
            localStorage.setItem('product-list', JSON.stringify(savedProductList));
            renderSavedProducts();
        }
    }

    function addToSavedProducts(product) {
        if (savedProductList.indexOf(product) === -1) {
            savedProductList.push(product);
            localStorage.setItem('product-list', JSON.stringify(savedProductList));
            renderSavedProducts();
        } else {
            alert(product + ' is already in your basket.')
        }
    }

    function getProductsData() {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', 'data/products.json');
            xhr.onload = function () {
                if (this.status >= 200 && this.status < 300) {
                    resolve(JSON.parse(xhr.response));
                } else {
                    reject({
                        status: this.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = function () {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            };
            xhr.send();
        });
    }

    view = {
        deleteFromSavedProducts: deleteFromSavedProducts,
        addToSavedProducts: addToSavedProducts
    }
}

function contactCtrl() {
    function submitForm() {
        var fname = document.getElementById('fname');
        var lname = document.getElementById('lname');
        var email = document.getElementById('email');
        var qType = document.getElementById('qType');
        var message = document.getElementById('message');

        var formValues = {
            firstName: fname.value,
            lastName: lname.value,
            email: email.value,
            messageReason: qType.value,
            message: message.value
        };

        alert(JSON.stringify(formValues));

        fname.value = '';
        lname.value = '';
        email.value = '';
        qType.value = '';
        message.value = '';
    }

    view = {
        submitForm: submitForm
    };
}
