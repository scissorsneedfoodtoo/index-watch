# index-watcher
<div align="center">
  <img width="400" height="300" src="https://user-images.githubusercontent.com/2051070/52254666-22d5ba00-2952-11e9-908c-05e53bf7a68e.jpg">
</div>

An AWS Lambda function that scrapes the latest price of an index fund, saves it to a database, and sends a notification after the stock market closes. Developed using the Serverless framework, DynamoDB, and Mailgun.

### Running the app

To use the app, clone this repository by entering `git clone https://github.com/scissorsneedfoodtoo/index-watcher.git` into your terminal/command prompt/bash shell. Next, enter `cd index-watcher` to change directories to the newly created index-watcher directory. Then install the necessary dependencies with `npm install` and `cp sample.env .env` to create a file to hold private local environment variables.

Make an account with Mailgun, verify the email address you wish to use, and enter your Mailgun API key, Mailgun domain, and your verified email address into the `.env` file. Go through the [Serverless AWS Quickstart Guide](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) to install serverless and set up your credentials.

Test the application by running `serverless invoke local --function getIndex`, which should respond with a JSON object:

```json
{
    "ticker": "VTSAX",
    "value": "$68.02",
    "pointChange": "0.48",
    "percentChange": "0.71%",
    "closingDate": "Feb 4, 2019"
}
```

Deploy the application to S3 by running `sls deploy`. Enter `serverless invoke --function getIndex` to run the Lambda function on the server. Once deployed, the app runs on a cron job every 10 minutes from 22:30 - 23:00 UTC Monday through Friday.

Note: Emails are not sent when running the app locally, but only when running from the server using the last command.

### Changing the index

This app is designed to scrape Market Watch for information about VTSAX, but it should be flexible enough to work with other stock or bond indexes, or even individual stocks. To track a different index/stock/bond, change the URL on [this line](https://github.com/scissorsneedfoodtoo/index-watcher/blob/692f54f17c0613bfe4fde8a128947e622af8d90a/handler.js#L8).

### Changing the cron schedule

Market Watch publishes new information about VTSAX pretty reliably at around 22:30 UTC, about an hour and a half after the markets close at 21:00 UTC. But this isn't always the case, especially with other indexes or individual stocks. You can adjust the rate the function runs by changing [this line](https://github.com/scissorsneedfoodtoo/index-watcher/blob/692f54f17c0613bfe4fde8a128947e622af8d90a/serverless.yml#L12) in the `serverless.yml` file. Remeber to redeploy with `sls deploy` after making adjustments to the cron schedule! See [this guide](https://serverless.com/framework/docs/providers/aws/events/schedule/) for more information.
