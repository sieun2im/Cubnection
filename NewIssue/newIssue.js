const issuesPage = document.querySelector('.issuesPage');


const issueList = [
    {

    }
]


const createIssue = () => {
    const issues = document.createElement('div');
    issues.classList.add('issues');

    const issueImg = document.createElement('img');
    // issueImg.setAttribute('src',);
    issueImg.classList.add('issueImg');

    const issueText = document.createElement('div');
    issueText.classList.add('issueText');

    const textH2 = document.createElement('h2');
    textH2.textContent = "df"

    const textH3 = document.createElement('h3');
    textH3.textContent = "ssd"

    const textP = document.createElement('p');
    textP.textContent = "aaw";

    issueText.appendChild(textH2);
    issueText.appendChild(textH3);
    issueText.appendChild(textP);
    issues.appendChild(issueImg);
    issues.appendChild(issueText);
    issuesPage.appendChild(issues);
}

createIssue();