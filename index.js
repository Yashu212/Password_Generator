const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCaseCheck = document.querySelector("#upperCase");
const lowerCaseCheck = document.querySelector("#lowerCase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-password");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");

let password = "";
let passwordLength = 8
let checkCount = 0;
handleSlider();
setIndicator('#ccc');
//set password length
function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = `${((passwordLength-min)*100/(max-min))}% 100%`;
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = "0px -3px 10px #ccc";

}

function getRandomInteger(min,max)
{
    return (Math.floor(Math.random()*(max-min))+min);
}
function getRandomNumber()
{
    return getRandomInteger(0,9);
}
function getLowerCase()
{
    return String.fromCharCode(getRandomInteger(97,123));
}
function getUpperCase()
{
    return String.fromCharCode(getRandomInteger(65,91))
}

function generateSymbol()
{
    let symbol = "+=_-)(*&^%$#@!`~<>?/{}[]\|,.";
    return symbol[getRandomInteger(0,symbol.length)]
}

function calcStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSymbol = false;
    if(upperCaseCheck.checked) 
        hasUpper = true;
    if(lowerCaseCheck.checked)
        hasLower = true;
    if(numbersCheck)
        hasNum = true;
    if(symbolsCheck)
        hasSymbol = true;
    if(hasUpper && hasLower && hasNum && hasSymbol && passwordLength >= 8)
        setIndicator("#0f0");
    else if((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >= 6)
        setIndicator("#ff0");
    else
        setIndicator("red");

}

async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied";
    }
    catch(e)
    {
        copyMsg.innerText = "Failed to copy";
    }
    copyMsg.classList.add("active");
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    console.log(passwordLength)
    handleSlider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();

})

function handleCheckBoxChange()
{
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    if(passwordLength < checkCount)
    {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change',handleCheckBoxChange);
})

function shufflePassword(arr)
{
    //Fisher Yates Method to shuffle the array: 
    for (let i = arr.length - 1; i > 0; i--)
    {
        let j = Math.floor(Math.random() * (i + 1)); 
        [arr[i], arr[j]] = [arr[j], arr[i]];
    } 
    let str = "";
    arr.forEach( (letter) => {
        str += letter;
    })
    return str;
}

generateBtn.addEventListener('click',()=>{
    if(checkCount <= 0)
        return;
    password = "";
    let funcarr = [];
    if(upperCaseCheck.checked)
        funcarr.push(getUpperCase);
    if(lowerCaseCheck.checked)
        funcarr.push(getLowerCase);
    if(numbersCheck.checked)
        funcarr.push(getRandomNumber); 
    if(symbolsCheck.checked)
        funcarr.push(generateSymbol);

    for(let i = 0;i<funcarr.length;i++)
        password += funcarr[i]();
    
    for(let i = 0;i<passwordLength-funcarr.length;i++)
    {
        password += funcarr[getRandomInteger(0,funcarr.length)]();
    }

    password = shufflePassword(Array.from(password));

    passwordDisplay.value = password;
    calcStrength();
})