"use strict";

module.exports = config => ({
  // Used for storing general files
  appFilesBucket: {
    Type: "AWS::S3::Bucket",
    Properties: {
      AccessControl: "Private",
      BucketName: `${config.env}-${config.appName}-files-bucket`,
      CorsConfiguration: {
        CorsRules: [
          {
            AllowedHeaders: ["*"],
            AllowedMethods: ["PUT", "GET"],
            AllowedOrigins: ["*"],
            ExposedHeaders: [],
            MaxAge: 3000,
          },
        ],
      },
      Tags: [
        {
          Key: "Name",
          Value: `${config.env}-${config.appName}-files-bucket`,
        },
        { Key: "Project", Value: config.appName },
        { Key: "Env", Value: config.env },
      ],
    },
    DeletionPolicy: config.s3DeletionPolicy,
  },
});
