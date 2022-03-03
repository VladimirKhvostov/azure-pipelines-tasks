const azdev = require('azure-devops-node-api');

/**
 * Gets PR's link from pull request id - since url property of GitPullRequest returns JSON
 */
function getPullRequestLink(repositoryWebUrl, pullRequestId) {
    return `${repositoryWebUrl}/pullrequest/${pullRequestId}`;
}

const orgUrl = "https://dev.azure.com/mseng";
const token = process.env.TOKEN;
if (!token) {
    throw new Exception('No token provided');
}
const releaseBranch = process.argv[2];
if (!releaseBranch) {
    throw new Exception('No release branch provided');
}
const azureDevOpsRepoId = "fb240610-b309-4925-8502-65ff76312c40";
const project = "AzureDevOps";

const pullRequestToCreate = {sourceRefName: `refs/heads/${releaseBranch}`,
                             targetRefName: 'refs/heads/users/v-dentikhomi/justtesttargetbranchfortestCourtesyPush',
                             title: 'TEST Courtesy Bump of Tasks',
                             description: 'Autogenerated PR to bump the versions of our first party tasks'
                            };

let authHandler = azdev.getPersonalAccessTokenHandler(token);

console.log('Getting connection');
let connection = new azdev.WebApi(orgUrl, authHandler);

console.log('Getting api');
connection.getGitApi().then(gitApi => {
    console.log('Creating PR');
    gitApi.createPullRequest(pullRequestToCreate, azureDevOpsRepoId, project).then(res => {
        const prLink = getPullRequestLink(res.repository.webUrl, res.pullRequestId);
        console.log(`Created PR ${prLink}`);
        const prLinkRes = prLink || 'https://dev.azure.com/mseng/AzureDevOps/_git/AzureDevOps/pullrequests?_a=active&createdBy=fe107a2d-fcce-6506-8e35-5554dbe120fd';
        console.log(`##vso[task.setvariable variable=PrID]${res.pullRequestId}`);
        console.log(`##vso[task.setvariable variable=PrLink]${prLinkRes}`);
    }).catch(err => {
        console.log(err);
        throw err;
    });
}).catch(err => {
    console.log(err);
    throw err;
});