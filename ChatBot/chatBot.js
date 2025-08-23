const input = document.querySelector('#inputQ');
const chatP = document.querySelector('#chatP');
const helloP = document.querySelector('#helloP');
const bestQ = document.querySelector('#bestQ');

const q1Btn = document.querySelector('#q1');
const q2Btn = document.querySelector('#q2');
const q3Btn = document.querySelector('#q3');
const qBtn = document.querySelectorAll('#bestQ>button')




document.addEventListener("DOMContentLoaded", async function recomendQ() {
    try {
        const res = await fetch('/api/chatbot/suggestions', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!res.ok) {
            console.log(res.status)
        }
        const data = await res.json();
        console.log('추천 질문 목록:', data);


        for (let i of qBtn) {
            q1Btn[i].textContent = data[i].text;
            console.log(data[i])
        }


    } catch (error) {
        console.log(error);
    }

})

//봇 채팅
const createBC = (answer) => {
    const botM = document.createElement('div');
    botM.classList = 'botM';
    const img = document.createElement('img');
    img.setAttribute('src', '../img/chatBot.svg');
    const botMDiv = document.createElement('div');
    const textB = document.createElement('div');
    textB.classList = 'textB';
    textB.textContent = answer;
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


}

async function enterP(e) {
    if (e.key === 'Enter' && input.value.trim()) {
        if (chatP.className === 'none') {
            helloP.classList = 'none';
            bestQ.classList = 'none';
            chatP.classList.remove('none');
        }
        createC();


        //springAI
        // try {
        //     console.log(input.value);
        //     const res = await fetch(`/api/chatbot?q= ${input.value}`);

        //     if (res.ok) {
        //         answer = await res.text();
        //         console.log(answer)
        //         createBC(answer);
        //     } else {
        //         console.log(res.status);
        //     }

        // } catch (error) {
        //     console.log(error);
        // }


        //langChain
        try {
            const res = await fetch("/api/chatbot/ask-lc4j", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: input.value.trim() })
            });

            if (res.ok) {
                answer = await res.text();
                console.log(answer)
                createBC(answer);
            } else {
                console.log(res.status)
            }
        } catch (error) {
            console.log(error);
        }

        input.value = "";



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
