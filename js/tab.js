let pillCont = document.querySelector("#pills-tab");
let pills = document.querySelectorAll("#pills-tab > li > button");
let contentLeft = document.querySelector("#pills-tabContent-left");
let contentRight = document.querySelector("pills-tabContent-right");


let htmlPill = document.querySelector("#pills-html-tab");
let cssPill = document.querySelector("#pills-css-tab");
let jsPill = document.querySelector("#pills-js-tab");
let phpPill = document.querySelector("#pills-php-tab");
let pythonPill = document.querySelector("#pills-python-tab");
let cplusPill = document.querySelector("#pills-cplus-tab");


let htmlPane = document.querySelectorAll(".pane-html");
let cssPane = document.querySelectorAll(".pane-css");
let jsPane = document.querySelectorAll(".pane-js");
let phpPane = document.querySelectorAll(".pane-php");
let pythonPane = document.querySelectorAll(".pane-python");
let cplusPane = document.querySelectorAll(".pane-cplus");

window.onload = pills.forEach(pill => {
    pill.addEventListener("click", () => {
        let currActive = document.querySelectorAll(".active");

        currActive.forEach(element => {
            element.classList.remove('active');
        });

        let target = pill.dataset.target;

        switch(target) {
            case "htmlPane":
                htmlPane.forEach(element => {
                    element.classList.add('active');
                });
            break;
            case "cssPane":
                cssPane.forEach(element => {
                    element.classList.add('active');
                });
            break;
            case "jsPane":
                jsPane.forEach(element => {
                    element.classList.add('active');
                });
            break;
            case "phpPane":
                phpPane.forEach(element => {
                    element.classList.add('active');
                });
            break;
            case "pythonPane":
                pythonPane.forEach(element => {
                    element.classList.add('active');
                });
            break;
            case "cplusPane":
                cplusPane.forEach(element => {
                    element.classList.add('active');
                });
            break;
        }

        pill.classList.add('active');
    });
});