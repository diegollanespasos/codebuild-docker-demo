# CI/CD Tools for Backend Project

This package includes a tool for generating the AWS CloudFormation template for building the base resources for the environments in AWS.

## Usage

1. Generate the template (SetupEnv.json) using: `npm run generate`
2. Go to CloudFormation in the AWS account and create a new stack, uploading the generated template and filling the correct parameters.

## Prerequisites

Before running the resulting script, the AWS account should have:

1. A key pair configured (name: app-dev by default)
2. Should not have any existing resource with the same name as resources created by this script
3. APIUrl and WebAppUrl correctly configured
4. Access to the "a" and "c" availability zones of the selected region (example: uz-east-2a and us-east-2c)

## Manual steps required after running the stack creation

1. Manually Run CodeBuild tasks in AWS (to deploy the backend and frontend for the first time)
2. Manually Run DB seed lambda function
3. Setup Frontend Domain:
   1. Request certificate for domain in AWS ACM (https://console.aws.amazon.com/acm/home?region=us-east-1#/)
   2. Edit CloudFront distribution to use domain and certificate
   3. Edit Domain DNS record to add a CNAME pointing to the cloudfront URL
4. Setup Backend Domain:
   1. Request certificate for domain in AWS ACM (us-east-2.console.aws.amazon.com/acm/home)
   2. Setup custom domain name In API Gateway (us-east-2.console.aws.amazon.com/apigateway/main/publish/domain-names)
   3. Select the newly created domain name, go to API mappings tab and setup the mapping
   4. Update your domain DNS settings and add a CNAME pointing to the API Gateway domain name
5. You may need to link your Github account manually to the CodeBuild project

## How to delete everything from the AWS account:

1. Manually delete all created S3 Buckets
2. Remove API Gateway mappings
3. Delete stacks from CloudFormation dashboard
