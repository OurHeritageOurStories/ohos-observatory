SlackMessage=""

#Fetch Slack webhook url from AWS secrets
SlackChannel=$(aws ssm get-parameters --names 'rae-ohos-notifications-slack-channel' --with-decryption --query 'Parameters[].Value' --output text --region=eu-west-2)

#Post message to slack handle
send_slack_message()
{
message=$1
message=$(tr -s '_' ' ' <<< "$message")

echo "SLACK_MESSAGE=${message} to ${SlackChannel}"

[ ! -z "$message" ] && curl -X POST -H 'Content-type: application/json' --data "{
              \"text\": \"${message}\"
      }" ${SlackChannel}
      
}

#Invoked from buildspec
send_slack_message $1
