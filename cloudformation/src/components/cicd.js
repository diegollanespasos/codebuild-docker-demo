"use strict";

module.exports = config => ({
  /*
    CI/CD Setup
  */

  // ECR - Hosts the Docker images for the app
  appContainerRepository: {
    Type: "AWS::ECR::Repository",
    Properties: {
      RepositoryName: `${config.env}-${config.appName}-backend`,
      RepositoryPolicyText: {
        Version: "2008-10-17",
        Statement: [
          {
            Sid: "AllowPushPull",
            Effect: "Allow",
            Principal: {
              AWS: [
                { "Fn::GetAtt": ["appBackendBuildRole", "Arn"] },
              ],
            },
            Action: [
              "ecr:GetDownloadUrlForLayer",
              "ecr:BatchGetImage",
              "ecr:BatchCheckLayerAvailability",
              "ecr:PutImage",
              "ecr:InitiateLayerUpload",
              "ecr:UploadLayerPart",
              "ecr:CompleteLayerUpload",
            ],
          },
        ],
      },
      Tags: [
        { Key: "Name", Value: `${config.env}-appBackendContainerRepository` },
        { Key: "Project", Value: config.appName },
        { Key: "Env", Value: config.env },
      ],
    },
  },

  // CodeBuild - Builds Docker images and uploads them to ECR
  appBackendBuildRole: {
    Type: "AWS::IAM::Role",
    Properties: {
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: {
          Effect: "Allow",
          Principal: {
            Service: "codebuild.amazonaws.com",
          },
          Action: "sts:AssumeRole",
        },
      },
      Policies: [
        {
          PolicyName: "root",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Effect: "Allow",
                Action: "events:*",
                Resource: "*",
              },
              {
                Action: [
                  "ecr:BatchCheckLayerAvailability",
                  "ecr:CompleteLayerUpload",
                  "ecr:GetAuthorizationToken",
                  "ecr:InitiateLayerUpload",
                  "ecr:PutImage",
                  "ecr:UploadLayerPart",
                  "s3:GetObject",
                ],
                Resource: "*",
                Effect: "Allow",
              },
            ],
          },
        },
      ],
      ManagedPolicyArns: ["arn:aws:iam::aws:policy/CloudWatchLogsFullAccess"],
    },
  },

  appBackendCodeBuild: {
    Type: "AWS::CodeBuild::Project",
    Properties: {
      Name: `${config.env}-${config.appName}-backend`,
      Description: `Builds ${config.appName} Docker image`,
      ServiceRole: { "Fn::GetAtt": ["appBackendBuildRole", "Arn"] },
      Artifacts: {
        Type: "CODEPIPELINE",
      },
      Environment: {
        Type: "LINUX_CONTAINER",
        ComputeType: "BUILD_GENERAL1_SMALL",
        Image: "aws/codebuild/standard:4.0",
        PrivilegedMode: true,
        EnvironmentVariables: [
          {
            Name: "IMAGE_REPO_NAME",
            Type: "PLAINTEXT",
            Value: `${config.env}-${config.appName}-backend`,
          },
          {
            Name: "IMAGE_TAG",
            Type: "PLAINTEXT",
            Value: `latest`,
          },
          {
            Name: "AWS_ACCOUNT_ID",
            Type: "PLAINTEXT",
            Value: { Ref: "AwsAccountId" },
          },
          {
            Name: "AWS_REGION",
            Type: "PLAINTEXT",
            Value: `${config.awsRegion}`,
          },
        ],
      },
      Source: {
        Type: "CODEPIPELINE",
      },
      SourceVersion: { Ref: "GitHubBranchBackend" },
      TimeoutInMinutes: 30,
      LogsConfig: {
        CloudWatchLogs: {
          Status: "ENABLED",
        },
      },
      Tags: [
        { Key: "Name", Value: `${config.env}-appBackendCodeBuild` },
        { Key: "Project", Value: config.appName },
        { Key: "Env", Value: config.env },
      ],
    },
  },

  // CodePipeline - Orchestrates CI/CD, when a merge is done to main branch, CodeBuild and then CodeDeploy are executed
  appCodePipelineArtifactStore: {
    Type: "AWS::S3::Bucket",
    Properties: {
      BucketName: `${config.env}-${config.appName}-codepipeline-artifactstore`,
      AccessControl: "Private",
      Tags: [
        { Key: "Name", Value: `${config.env}-appCodePipelineArtifactStore` },
        { Key: "Project", Value: config.appName },
        { Key: "Env", Value: config.env },
      ],
    },
  },

  appCodePipelineServiceRole: {
    Type: "AWS::IAM::Role",
    Properties: {
      AssumeRolePolicyDocument: {
        Version: "2012-10-17",
        Statement: {
          Effect: "Allow",
          Principal: {
            Service: "codepipeline.amazonaws.com",
          },
          Action: "sts:AssumeRole",
        },
      },
      Policies: [
        {
          PolicyName: "root",
          PolicyDocument: {
            Version: "2012-10-17",
            Statement: [
              {
                Action: ["iam:PassRole"],
                Resource: "*",
                Effect: "Allow",
                Condition: {
                  StringEqualsIfExists: {
                    "iam:PassedToService": [
                      "cloudformation.amazonaws.com",
                      "elasticbeanstalk.amazonaws.com",
                      "ec2.amazonaws.com",
                      "ecs-tasks.amazonaws.com",
                    ],
                  },
                },
              },
              {
                Action: [
                  "codecommit:CancelUploadArchive",
                  "codecommit:GetBranch",
                  "codecommit:GetCommit",
                  "codecommit:GetRepository",
                  "codecommit:GetUploadArchiveStatus",
                  "codecommit:UploadArchive",
                ],
                Resource: "*",
                Effect: "Allow",
              },
              {
                Action: ["codestar-connections:UseConnection"],
                Resource: "*",
                Effect: "Allow",
              },
              {
                Action: [
                  "elasticbeanstalk:*",
                  "ec2:*",
                  "elasticloadbalancing:*",
                  "autoscaling:*",
                  "cloudwatch:*",
                  "s3:*",
                  "sns:*",
                  "cloudformation:*",
                  "rds:*",
                  "sqs:*",
                  "ecs:*",
                ],
                Resource: "*",
                Effect: "Allow",
              },
              {
                Action: ["lambda:InvokeFunction", "lambda:ListFunctions"],
                Resource: "*",
                Effect: "Allow",
              },
              {
                Action: [
                  "opsworks:CreateDeployment",
                  "opsworks:DescribeApps",
                  "opsworks:DescribeCommands",
                  "opsworks:DescribeDeployments",
                  "opsworks:DescribeInstances",
                  "opsworks:DescribeStacks",
                  "opsworks:UpdateApp",
                  "opsworks:UpdateStack",
                ],
                Resource: "*",
                Effect: "Allow",
              },
              {
                Action: [
                  "cloudformation:CreateStack",
                  "cloudformation:DeleteStack",
                  "cloudformation:DescribeStacks",
                  "cloudformation:UpdateStack",
                  "cloudformation:CreateChangeSet",
                  "cloudformation:DeleteChangeSet",
                  "cloudformation:DescribeChangeSet",
                  "cloudformation:ExecuteChangeSet",
                  "cloudformation:SetStackPolicy",
                  "cloudformation:ValidateTemplate",
                ],
                Resource: "*",
                Effect: "Allow",
              },
              {
                Action: [
                  "codebuild:BatchGetBuilds",
                  "codebuild:StartBuild",
                  "codebuild:BatchGetBuildBatches",
                  "codebuild:StartBuildBatch",
                ],
                Resource: "*",
                Effect: "Allow",
              },
              {
                Effect: "Allow",
                Action: [
                  "devicefarm:ListProjects",
                  "devicefarm:ListDevicePools",
                  "devicefarm:GetRun",
                  "devicefarm:GetUpload",
                  "devicefarm:CreateUpload",
                  "devicefarm:ScheduleRun",
                ],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: [
                  "servicecatalog:ListProvisioningArtifacts",
                  "servicecatalog:CreateProvisioningArtifact",
                  "servicecatalog:DescribeProvisioningArtifact",
                  "servicecatalog:DeleteProvisioningArtifact",
                  "servicecatalog:UpdateProduct",
                ],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: ["cloudformation:ValidateTemplate"],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: ["ecr:DescribeImages"],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: [
                  "states:DescribeExecution",
                  "states:DescribeStateMachine",
                  "states:StartExecution",
                ],
                Resource: "*",
              },
              {
                Effect: "Allow",
                Action: [
                  "appconfig:StartDeployment",
                  "appconfig:StopDeployment",
                  "appconfig:GetDeployment",
                ],
                Resource: "*",
              },
            ],
          },
        },
      ],
    },
  },

  appCodePipelineWebhook: {
    Type: "AWS::CodePipeline::Webhook",
    Properties: {
      Authentication: "GITHUB_HMAC",
      AuthenticationConfiguration: {
        SecretToken: { Ref: "GitHubOAuthToken" },
      },
      Filters: [
        {
          JsonPath: "$.ref",
          MatchEquals: "refs/heads/{Branch}",
        },
      ],
      TargetPipeline: {
        Ref: "appCodePipeline",
      },
      TargetAction: "SourceAction",
      Name: `${config.env}-appCodePipelineWebhook`,
      TargetPipelineVersion: {
        "Fn::GetAtt": ["appCodePipeline", "Version"],
      },
      RegisterWithThirdParty: true,
    },
  },

  appCodePipeline: {
    Type: "AWS::CodePipeline::Pipeline",
    Properties: {
      RoleArn: { "Fn::GetAtt": ["appCodePipelineServiceRole", "Arn"] },
      Stages: [
        {
          Name: "Source",
          Actions: [
            {
              Name: "SourceAction",
              ActionTypeId: {
                Category: "Source",
                Owner: "ThirdParty",
                Version: "1",
                Provider: "GitHub",
              },
              OutputArtifacts: [{ Name: "SourceOutput" }],
              Configuration: {
                Owner: { Ref: "GitHubOwner" },
                Repo: { Ref: "GitHubRepoBackend" },
                Branch: { Ref: "GitHubBranchBackend" },
                OAuthToken: { Ref: "GitHubOAuthToken" },
                PollForSourceChanges: false,
              },
              RunOrder: 1,
            },
          ],
        },
        {
          Name: "Build",
          Actions: [
            {
              Name: "BuildAction",
              InputArtifacts: [
                {
                  Name: "SourceOutput",
                },
              ],
              ActionTypeId: {
                Category: "Build",
                Owner: "AWS",
                Version: "1",
                Provider: "CodeBuild",
              },
              Configuration: {
                ProjectName: { Ref: "appBackendCodeBuild" },
              },
              RunOrder: 1,
            },
          ],
        },
      ],
      ArtifactStore: {
        Type: "S3",
        Location: { Ref: "appCodePipelineArtifactStore" },
      },
      Tags: [
        { Key: "Name", Value: `${config.env}-appCodePipeline` },
        { Key: "Project", Value: config.appName },
        { Key: "Env", Value: config.env },
      ],
    },
  },
});
