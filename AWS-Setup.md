# First time set-up on AWS A/c research-ohos AC id 259004456259

Login to AWS web console from the link 
https://research-ohos.signin.aws.amazon.com/console

Your username and password will be provided by the administrator 


## Requirements

### Install AWS cli

Download and install aws cli on your machine 
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html

You can check if the installation succeded by typing this command on your terminal 

aws --version 

You can see output similar to aws-cli/2.0.24 Python/3.7.4 Darwin/21.5.0 botocore/2.0.0dev28

### Setup AWS command line 
You can do this by typing the command 

aws configure

AWS Access Key ID - Enter AWS access key given by your administrator

AWS Secret Access Key - Enter AWS access key given by your administrator

Default region name [None]: eu-west-2

Default output format [None]: Skip by pressing Enter


To verify aws cli configuration you can try a aws command such as 

aws s3 ls 


## Pull Docker Image from ECR

You will need to login to Elastic Container register as a first step - this can be done by the command 

aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 259004456259.dkr.ecr.eu-west-2.amazonaws.com

AWS Command to pull the latest docker image 

docker pull 259004456259.dkr.ecr.eu-west-2.amazonaws.com/ohos-observatory-frontend:latest



You can verify the pulled image by typing the command 

docker images -a 


The downloaded image will have the following name and tag 

259004456259.dkr.ecr.eu-west-2.amazonaws.com/ohos-observatory-frontend  latest

 
## Run the docker Image downloaded from ECR locally
If you wish to run the newly built image from AWS, edit the docker-compose file by replacing the locally built image, ohos_observatory_frontend with 259004456259.dkr.ecr.eu-west-2.amazonaws.com/ohos-observatory-frontend

Then you can run the docker-compose up command

Locally built ohos_observatory_frontend image
  kong_vue_frontend:
    image: ohos_observatory_frontend

AWS built ohos_observatory_frontend image
  kong_vue_frontend:
    image: 259004456259.dkr.ecr.eu-west-2.amazonaws.com/ohos-observatory-frontend
 
