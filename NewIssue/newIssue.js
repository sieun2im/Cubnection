const issuesPage = document.querySelector('.issuesPage');



const cateImg = (issueImg, category) => {
    if (category === "정육점") {
        issueImg.setAttribute('src', "../img/meat.jpg");
    } else if (category === "야채가게") {
        issueImg.setAttribute('src', "../img/greenFood.jpg");
    } else if (category === "생선가게") {
        issueImg.setAttribute('src', "../img/fish.jpg");
    } else if (category === "분식") {
        issueImg.setAttribute('src', "../img/boonsik.jpg");
    } else if (category === "베이커리") {
        issueImg.setAttribute('src', "../img/bread.jpg");
    } else if (category === "반찬가게") {
        issueImg.setAttribute('src', "../img/banchan.jpg");
    } else if (category === "중식당") {
        issueImg.setAttribute('src', "../img/china.jpg");
    } else if (category === "치킨") {
        issueImg.setAttribute('src', "../img/chicken,jpg");
    } else if (category === "횟집") {
        issueImg.setAttribute('src', "../img/fishfood.jpg");
    } else if (category === "한식") {
        issueImg.setAttribute('src', "../img/korea.jpg");
    } else if (category === "떡집") {
        issueImg.setAttribute('src', "../img/ddok.jpg");
    }

}


document.addEventListener('DOMContentLoaded', async function () {

    try {
        const res = await fetch('/api/stores/popular', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!res.ok) {
            console.log(res.status);
        }

        const data = await res.json();

        console.log(data)

        const createIssue = (issue) => {
            const issues = document.createElement('div');
            issues.classList.add('issues');
            issues.addEventListener('click', () => { window.location = `../../chatpage/chatpage.html?storeId=${encodeURIComponent(issue.id)}` });

            const issueImg = document.createElement('img');

            cateImg(issueImg, issue.category);
            // issueImg.setAttribute('src',);
            issueImg.classList.add('issueImg');

            const issueText = document.createElement('div');
            issueText.classList.add('issueText');

            const textH2 = document.createElement('h2');
            textH2.textContent = issue.name;

            const textH3 = document.createElement('h3');
            textH3.innerHTML = `${issue.category} · <b>${issue.searchCount}</b>회 검색`;

            const textP = document.createElement('p');
            textP.innerHTML = "지금 가장 주목받는 상점이에요.<br/>눌러서 상세 보러 가기!";

            issueText.appendChild(textH2);
            issueText.appendChild(textH3);
            issueText.appendChild(textP);
            issues.appendChild(issueImg);
            issues.appendChild(issueText);
            issuesPage.appendChild(issues);
        }


        data.forEach(issue => {
            createIssue(issue);
        });


    } catch (error) {
        console.log(error)
    }
}
);



