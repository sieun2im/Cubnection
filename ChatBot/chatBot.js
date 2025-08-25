const input = document.querySelector('#inputQ');
const chatP = document.querySelector('#chatP');
const helloP = document.querySelector('#helloP');
const bestQ = document.querySelector('#bestQ');


const qBtn = document.querySelectorAll('#bestQ>button')



//추천질문 API
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
        console.log(data[1].text)

        let i = 0;
        qBtn.forEach(btn => {
            btn.setAttribute('id', data[i].id)
            btn.textContent = data[i].text;
            console.log(btn.id);

            i++;
        });



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

//AI API
async function enterP(e) {
    if (e.key === 'Enter' && input.value.trim()) {
        if (chatP.className === 'none') {
            helloP.classList = 'none';
            bestQ.classList = 'none';
            chatP.classList.remove('none');
        }
        createC();
        enterClick();


        //springAI
        // try {
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




async function keywordFetch(foundKeyword) {

    try {
        const res = await fetch(`/api/stores/search?keyword=${foundKeyword}`);
        if (!res.ok) {
            console.log(res.status);
        } else {
            console.log("키워드 1 up");
        }

    } catch (error) {
        console.log(error);
    }


}

const keywords = [
    "짜장면", "짬뽕", "탕수육", "중식", "칼국수", "국수", "냉면",
    "회", "초밥", "스시", "분식", "떡볶이", "순대", "튀김", "김밥",
    "치킨", "피자", "햄버거", "빵", "베이커리", "떡", "전", "반찬"
];

const enterClick = () => {
    const foundKeywords = keywords.filter(keyword => input.value.includes(keyword));

    if (foundKeywords.length > 0) {
        foundKeywords.forEach(foundKeyword => {
            keywordFetch(foundKeyword);
            console.log(foundKeyword)
        });
    }
}


//추천질문 응답 API
async function clickQBtn(e) {
    helloP.classList = 'none';
    bestQ.classList = 'none';
    chatP.classList.remove('none');
    input.value = e.target.textContent;
    createC();

    try {
        const res = await fetch(`/api/chatbot/ask-suggestion/${e.target.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.log(res.status)
        }
        const recomendA = await res.json();
        createBC(recomendA.answer);
    } catch (error) {
        console.log(error)
    }

    input.value = "";
}


async function clickUpApi(e) {
    try {
        const res = await fetch(`/api/chatbot/suggestions/${e.target.id}/click`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!res.ok) {
            console.log(res.status)
        }
    } catch (error) {
        console.log(error)
    }
}

qBtn[0].addEventListener('click', clickQBtn);
qBtn[1].addEventListener('click', clickQBtn);
qBtn[2].addEventListener('click', clickQBtn);
qBtn[3].addEventListener('click', clickQBtn);
qBtn[4].addEventListener('click', clickQBtn);

qBtn[0].addEventListener('click', clickUpApi);
qBtn[1].addEventListener('click', clickUpApi);
qBtn[2].addEventListener('click', clickUpApi);
qBtn[3].addEventListener('click', clickUpApi);
qBtn[4].addEventListener('click', clickUpApi);

input.addEventListener('keypress', enterP);

