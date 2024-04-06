const userLanguageDropdown = document.querySelector('.dropdown');
const translateLanguageDropdown = document.querySelector('#another-language');
const mainScreen = document.querySelector('.main-screen')

const inputContent = document.querySelector('#validatedInput');
const output = document.querySelector('#output');
const outputLang = document.querySelector('#output-lang');
const valInput = document.querySelector("#initial-input");

const runBtnWrap = document.querySelector('#validation-btn-wrap');
const btnWrap = document.querySelector('#btn-grp');
const modal = document.querySelector('.validation-screen');

let firstOption;
let originalInput;

let initLang;
let isError;

runBtnWrap.style.display = 'block';
btnWrap.style.display = 'none';


const runBtn = document.querySelector('#validation-btn');
runBtn.addEventListener('click', function () {
    originalInput = valInput.value;
    getValidate(valInput.value);
});


const acceptBtn = document.querySelector('#accept-btn');
acceptBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    inputContent.value = valInput.value;
    mainScreen.style.display = 'flex';
    getMessage(firstOption, inputContent.value);
});

const keepBtn = document.querySelector('#keep-btn');
keepBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    inputContent.value = originalInput;
    mainScreen.style.display = 'flex';
    getMessage(firstOption, inputContent.value);
});

const retryBtn = document.querySelector('#retry-btn');
retryBtn.addEventListener('click', () => {
    valInput.value = ''
    runBtnWrap.style.display = 'block';
    btnWrap.style.display = 'none';
})

const newBtn = document.querySelector('#new-input-btn');
newBtn.style.display = 'none';
newBtn.addEventListener('click', () => {
    location.reload();
})

/* dropdown*/
userLanguageDropdown.addEventListener('change', function () {
    firstOption = this.value;
    console.log('User Language Selected:', firstOption);
});

translateLanguageDropdown.addEventListener('change', function () {
    firstOption = this.value;
    console.log('another Language Selected:', firstOption);
});

const translateBtn = document.querySelector('#translate-btn');
translateBtn.addEventListener('click', () => {
    getMessage(firstOption, inputContent.value);
});




/**** change fetch uri to your domain (https://yourdomain.com/validate_code.php) ********/
async function getValidate(value) {
    const spinner = document.querySelector('#spinner-screen1');
    spinner.style.display = 'flex';

    try {
        const response = await fetch('https://cypher.leeorburton.com/validate_code.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userinput: value }) // Include userinput in the request body
        });

        const data = await response.json();

        // Handle responses from PHP script
        const langResponse = data.langResponse;
        const errorResponse = data.errorResponse;
        const correctedResponse = data.correctedResponse;

        // Handle each response as needed
        const initLang = langResponse.choices[0].message.content;
        const isError = errorResponse.choices[0].message.content;
        const corrected = correctedResponse.choices[0].message.content;

        const inputLang = document.querySelector("#input-lang");

        if (isError === "True") {
            runBtnWrap.style.display = 'none';
            btnWrap.style.display = 'flex';
            valInput.value = corrected;
            inputLang.textContent = initLang;
        } else {
            modal.style.display = 'none';
            inputContent.value = valInput.value;
            mainScreen.style.display = 'flex';
            btnWrap.style.display = 'flex';
            inputLang.textContent = initLang;
            getMessage(firstOption, inputContent.value);
        }

    } catch (error) {
        console.log('Error:', error);

    } finally {
        spinner.style.display = 'none';
    }
}


/**** change fetch uri to your domain (https://yourdomain.com/validate_code.php) ********/
async function getMessage(language, value) {
    const confirmImg = document.querySelector('#confirm-img');
    confirmImg.style.display = 'none';

    const spinner = document.querySelector('#spinner-screen2');
    spinner.style.display = 'flex';

    console.log('translation-clicked');

    try {
        const response = await fetch('https://cypher.leeorburton.com/get_message.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstOption: language, userinput: value })
        });
        const data = await response.json();

        output.textContent = data.choices[0].message.content;
        outputLang.textContent = firstOption;
        if (data.choices[0].message.content && inputContent.value) {
            const pElement = document.createElement('p');
            pElement.textContent = output.value;
            confirmImg.style.display = 'flex';

            console.log(output);
        }
    } catch (error) {
        console.error(error);

    } finally {
        spinner.style.display = 'none';
        newBtn.style.display = 'block';
    }
}




