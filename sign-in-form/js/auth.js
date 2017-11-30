'use strict';

const signIn = document.querySelector('.sign-in-htm');
const signUp = document.querySelector('.sign-up-htm');

function handleForm(form, to) {
    const button = form.querySelector('[type = "submit"]');
    const message = form.querySelector('output');

    function createDataJSON(form) {
        const formData = new FormData(form);
        const data = {};

        for (const [k, v] of formData) {
            data[k] = v;
        }

        return JSON.stringify(data);
    }

    function sendFormData(to) {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('load', function(e) {
            const response = JSON.parse(xhr.response);
            if (response.error) {
                message.textContent = response.message;
            } else {
                switch (form) {
                    case signIn:
                        message.textContent = `Пользователь ${response.name} успешно авторизован`;
                        break;
                    case signUp:
                        message.textContent = `Пользователь ${response.name} успешно зарегистрирован`;
                        break;
                    default:
                        break;
                }
            }
        });

        xhr.open('POST', to);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(createDataJSON(form))
    }

    function handleClick(e) {
        e.preventDefault();
        sendFormData(to);
    }

    button.addEventListener('click', handleClick);
}

handleForm(signIn, 'https://neto-api.herokuapp.com/signin');

handleForm(signUp, 'https://neto-api.herokuapp.com/signup')
