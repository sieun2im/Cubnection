const issuesPage = document.querySelector('.issuesPage');



const issueList = [];

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

        issueList = await res.json()

    } catch (error) {
        console.log(error)
    }
})



const createIssue = (issue) => {
    const issues = document.createElement('div');
    issues.classList.add('issues');

    const issueImg = document.createElement('img');
    // issueImg.setAttribute('src',);
    issueImg.classList.add('issueImg');

    const issueText = document.createElement('div');
    issueText.classList.add('issueText');

    const textH2 = document.createElement('h2');
    textH2.textContent = issue.name;

    const textH3 = document.createElement('h3');
    textH3.textContent = issue.category;

    const textP = document.createElement('p');
    textP.textContent = "aaw";

    issueText.appendChild(textH2);
    issueText.appendChild(textH3);
    issueText.appendChild(textP);
    issues.appendChild(issueImg);
    issues.appendChild(issueText);
    issuesPage.appendChild(issues);
}

issueList.forEach(issue => {
    createIssue(issue);
});

