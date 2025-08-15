const input = document.querySelector('#inputQ');
const chatP = document.querySelector('#chatP');
const helloP = document.querySelector('#helloP');
const bestQ = document.querySelector('#bestQ');

const q1Btn = document.querySelector('#q1');
const q2Btn = document.querySelector('#q2');
const q3Btn = document.querySelector('#q3');




//봇 채팅
const createBC = () => {
    const botM = document.createElement('div');
    botM.classList = 'botM';
    const img = document.createElement('img');
    img.setAttribute('src', '../img/chatBot.svg');
    const botMDiv = document.createElement('div');
    const textB = document.createElement('div');
    textB.classList = 'textB';
    textB.textContent = "통신으로 받아온 값";
    const dateP = document.createElement('p');
    dateP.classList = 'date';
    dateP.textContent = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Seoul'
    });

    botMDiv.appendChild(textB);
    botMDiv.appendChild(dateP);
    botM.appendChild(img);
    botM.appendChild(botMDiv);
    chatP.appendChild(botM);

    chatP.scrollTop = chatP.scrollHeight;
}

//사용자 채팅
const createC = () => {
    const userM = document.createElement('div');
    userM.classList = 'userM';
    const textU = document.createElement('div');
    textU.classList = 'textU';
    textU.textContent = input.value;
    const dateP = document.createElement('p');
    dateP.classList = 'date';
    dateP.textContent = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'Asia/Seoul'
    });

    userM.appendChild(textU);
    userM.appendChild(dateP);
    chatP.appendChild(userM);

    chatP.scrollTop = chatP.scrollHeight;

    input.value = "";
}

const enterP = (e) => {
    if (e.key === 'Enter' && input.value.trim()) {
        if (chatP.className === 'none') {
            helloP.classList = 'none';
            bestQ.classList = 'none';
            chatP.classList.remove('none');
        }

        createC()
    }
}


const clickQBtn = (e) => {
    helloP.classList = 'none';
    bestQ.classList = 'none';
    chatP.classList.remove('none');
    input.value = e.target.textContent;
    createC();
}

q1Btn.addEventListener('click', clickQBtn);
q2Btn.addEventListener('click', clickQBtn);
q3Btn.addEventListener('click', clickQBtn);
input.addEventListener('keypress', enterP);


// const textarea = document.querySelector('textarea');
// const textDiv = document.querySelector('.textDiv');

// const textP = () => {
//     console.log('aa')
//     textDiv.textContent = textarea.value;
// }

// const textareaF = () => {
//     console.log('a')
//     textarea.focus();
// }

// textDiv.addEventListener('click', textareaF);
// textarea.addEventListener('input', textP);
