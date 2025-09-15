const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMSG]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbol");
const indicator= document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generate-button");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>?/';

let password="";
let passwordLength=10;
let checkCount=1;
handleSlider();

function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText = passwordLength;
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
}

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
      return getRndInteger(0,9);
}


function generateLowecase(){
    return String.fromCharCode(getRndInteger(97,123))
}

function generateUppercase(){
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbols(){
    const randNum = getRandInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.Checked) hasUpper = true;
    if (lowercaseCheck.Checked) hasLower = true;
    if (numberCheck.Checked) hasNum = true;
    if (symbolsCheck.Checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength>=8){
        setIndicator("#0f0");
    } else if(
        (hasLower || hasUpper)&&
        (hasNum || hasSym) && 
        passwordLength >= 6
    ){
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="Copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }

    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    },2000);
    
}


function shufflePassword(){
    for (let i=Array.length-1; i>0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        const temp = Array[i];

        Array[i] = Array[j];
        Array[j]= temp;

    }

    let str = "";
    Array.forEach((el)=>(str +=el));

    return str;
}


function handleCheckBoxChange (){
    checkCount=0;
    allCheckBox.forEach((checkbox) =>{
        if (checkbox.Checked)
            checkCount++;
    });


    if (passwordLength < checkCount){
        passwordLength = checkCount;  
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change' , handleCheckBoxChange);
})

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
        
    
})

generateBtn.addEventListener('click', () =>{
    if (checkCount<=0) return ;

    if (passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }



    password="";

    // if (uppercaseCheck.checked){
    //     password += generateUppercase();

    // }

    //  if (lowercaseCheck.checked){
    //     password += generateLowecase();
        
    // }

    //  if (numberCheck.checked){
    //     password += generateRandomNumber();
        
    // }

    //  if (symbolsCheck.checked){
    //     password += generateSymbols();
        
    // }

    let funcarr = [];

    if (uppercaseCheck.checked)
        funcarr.push(generateUppercase);

    if (lowercaseCheck.checked)
        funcarr.push(generateLowecase);

    if (numberCheck.checked)
        funcarr.push(generateRandomNumber);

    if (symbolsCheck.checked)
        funcarr.push(generateSymbols);

    for (let i=0; i<funcarr.length;i++){
        password +=funcarr[i]();
    }

    for (let i=0; i<passwordLength-funcarr.length;i++){
        let randIndex = getRndInteger(0,funcarr.length);
        password += funcarr[randIndex]();

    }

    password = shufflePassword(Array.from(password));



    passwordDisplay.value = password;

    calcStrength();

})


 





