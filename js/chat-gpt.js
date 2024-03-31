// MESSAGE FROM LEEOR: WHAT I DID
// I added 2 additional requests from the API, first it asks what language the input is written in, then returns a string (true or false) alerting of any errors, lastly it fixes the errors.
// after the 3 queries are requested and a responses are returned, the initial input language is started in the "initLang" variable and the boolean is stored in the "isError" variable

// const apiKey = '';
const userLanguageDropdown = document.querySelector('.dropdown');
const translateLanguageDropdown = document.querySelector('#another-language');
const mainScreen = document.querySelector('.main-screen')

const inputContent = document.querySelector('#userInput');
const output = document.querySelector('#output');
const outputLang = document.querySelector('#output-lang')

const valInput = document.querySelector("#validation-code");
const runBtnWrap = document.querySelector('#validation-btn-wrap');
const btnWrap = document.querySelector('#btn-grp');
const modal = document.querySelector('.valitation-screen');

let firstOption;
let secondOption;
let originalInput = '';

// ************* New variables
let initLang;
let isError;

runBtnWrap.style.display = 'block';
btnWrap.style.display = 'none';

const runBtn = document.querySelector('#validation-btn');
runBtn.addEventListener('click', getValidate);

const translateBtn = document.querySelector('#translate-btn');
translateBtn.addEventListener('click', getMessage);

const acceptBtn = document.querySelector('#accept-btn');
acceptBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    inputContent.value = valInput.value;
    mainScreen.style.display = 'flex';
    getMessage();
});

const keepBtn = document.querySelector('#keep-btn');
keepBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    inputContent.value = originalInput;
    mainScreen.style.display = 'flex';
    btnWrap.style.display = 'block';
    getMessage();
});

const retryBtn = document.querySelector('#retry-btn');
retryBtn.addEventListener('click', () => {
    valInput.value = ''
    runBtnWrap.style.display = 'block';
    btnWrap.style.display = 'none';
})

const newBtn = document.querySelector('#new-input-btn');
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

async function getValidate() {
    const spinner = document.querySelector('.spinner-screen');
    spinner.style.display = 'flex';
    console.log('Validation clicked');

    originalInput = valInput.value;

    console.log(firstOption);

    // ************* first new request
    const checkError = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `In only one word true or false, are there errors in this code: ${valInput.value}`
                }
            ],
            max_tokens: 1000
        })
    }

    // ************* second new request
    const checkLang = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `In one word, what coding language is ${valInput.value} written in.`
                }
            ],
            max_tokens: 1000
        })
    }

    // ************* same but without checks
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Correct errors in this code with inline comments about changes: ${valInput.value}`
                }
            ],
            max_tokens: 1000
        })
    }
    try {
        // ************* fetch responses
        const [langResponse, errorResponse, correctedResponse] = await Promise.all([
            fetch('https://api.openai.com/v1/chat/completions', checkLang),
            fetch('https://api.openai.com/v1/chat/completions', checkError),
            fetch('https://api.openai.com/v1/chat/completions', options)
        ]);

        initLang = await langResponse.json();
        isError = await errorResponse.json();
        const corrected = await correctedResponse.json();

        // check if errors were found and handle accordingly
        if (isError.choices[0].message.content === "True") {
            runBtnWrap.style.display = 'none';
            btnWrap.style.display = 'block';
            valInput.value = corrected.choices[0].message.content;
        } else {
            modal.style.display = 'none';
            inputContent.value = originalInput;
            mainScreen.style.display = 'flex';
            btnWrap.style.display = 'block';
            getMessage();
        }

    } catch (error) {
        console.error(valInput.value);
    } finally {
        spinner.style.display = 'none';
    }
}

async function getMessage() {
    const confirmImg = document.querySelector('#confirm-img');
    confirmImg.style.display = 'none';

    const spinner = document.querySelector('.spinner-screen');
    spinner.style.display = 'flex';

    console.log('translation-clicked');
    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `Can you translate this code below to ${firstOption}? ${inputContent.value}`
                }
            ],
            max_tokens: 1000
        })
    }
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        output.textContent = data.choices[0].message.content;
        outputLang.textContent = firstOption;
        if (data.choices[0].message.content && inputContent.value) {
            const pElement = document.createElement('p');
            pElement.textContent = output.value;
            confirmImg.style.display = 'flex';
            console.log(output)
        }
    } catch (error) {
        console.error(error);

    } finally {
        spinner.style.display = 'none';
    }
}




