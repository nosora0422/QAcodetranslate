// const apiKey = '';
const userLanguageDropdown = document.querySelector('#user-language');
const translateLanguageDropdown = document.querySelector('#translate-language');
const confirmImg = document.querySelector('#confirm-img');

const inputContent = document.querySelector('#userInput');
const retryBtn = document.querySelector('#retry-btn');
const translateBtn = document.querySelector('#translate-btn');
const output = document.querySelector('#output')
const valBtn = document.querySelector('#validation-btn')

const valInput = document.querySelector("#validation-code");
const valBtnWrap = document.querySelector('#validation-btn-wrap');
const btnWrap = document.querySelector('#btn-grp');
const acceptBtn = document.querySelector('#accept-btn');
const keepBtn = document.querySelector('#keep-btn'); 
const modal = document.querySelector('.modal-screen');


valBtnWrap.style.display = 'block';
btnWrap.style.display = 'none';
confirmImg.style.display = 'none';


let firstOption;
let secondOption;
let originalInput = '';



async function getValidate() {
    console.log('Validation clicked');

    originalInput = valInput.value;

    console.log(firstOption);

    const options = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
                model: "gpt-3.5-turbo-instruct",
                messages: [
                  {
                    role: "system",
                    content: `Can you detect what language this code was written in and debug ${valInput.value}? On return, if there are no errors, return just the word true. If there is an error, tell me what language it was. If there are errors, show only the new output with inline comments on what was changed in exclusively ${firstOption}. Remove any markdown`
                  }
                ],
                max_tokens: 1000
        })
    }
    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        
        if (data.choices[0].message.content && valInput.value){
            valBtnWrap.style.display = 'none';
            btnWrap.style.display = 'block';
            valInput.value = data.choices[0].message.content;
            console.log(output)
        }
    } catch(error){
        console.error(valInput.value);

    }
}


async function getMessage() {
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
                    content: `Can you translate any code in ${inputContent.value} to ${secondOption}? `
                  }
                ],
                max_tokens: 1000
        })
    }
    try{
        const response = await fetch('https://api.openai.com/v1/chat/completions', options);
        const data = await response.json();
        output.textContent = data.choices[0].message.content;
        if (data.choices[0].message.content && inputContent.value){
            const pElement = document.createElement('p');
            pElement.textContent = output.value;
            confirmImg.style.display = 'block';
            // pElement.addEventListener('click', () => changeInput(pElement.textContent));
            // pElement.classList.add('hstr-item','card-item');
            console.log(output)
        }
    } catch(error){
        console.error(error);

    }
}

valBtn.addEventListener('click', getValidate);
translateBtn.addEventListener('click', getMessage);
acceptBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    inputContent.value = valInput.value;
});
keepBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    inputContent.value = originalInput;
});

retryBtn.addEventListener('click', () => {
    valInput.value = ''
    valBtnWrap.style.display = 'block';
    btnWrap.style.display = 'none';
})


// newChatbtn.addEventListener('click', clearInput);

/* dropdown*/
userLanguageDropdown.addEventListener('change', function() {
    firstOption = this.value;
    console.log('User Language Selected:', firstOption);
});

translateLanguageDropdown.addEventListener('change', function() {
    secondOption = this.value;
    console.log('Translation Language Selected:', secondOption);
});




