const issuesPage = document.querySelector('.issuesPage');





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



