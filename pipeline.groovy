#!/usr/bin/env groovy

pipeline {
    
    agent any
    
    parameters {
        string(name: 'BRANCH', defaultValue: 'develop-ksquare', description: 'Stage Env Branch')
        string(name: 'REPOSITORY', defaultValue: 'git@gitlab.com:ksjsgroup/lms-savvy/savvy-back-courses.git', description: 'LMS Courses Service Repo URL')
    }
    
    stages {
        
        stage('PULL LMS COURSES REPO') {
            steps {
                git (
                    credentialsId: "ksquareDevOps",
                    url: "${params.REPOSITORY}",
                    branch: "${params.BRANCH}"
                )
            }
        } // end stage
        
        stage('DELETE IMAGE') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                    sh 'docker rmi zanma_back_courses:qa'
                }
            }
        } // end stage*/

        stage('BUILD IMAGE') {
            steps {
                sh 'cd /var/lib/jenkins/workspace/Build_LMS_Back_Courses_Stage && cp .env.example .env && docker build -f Dockerfile -t zanma_back_courses:qa . '    
            }
        } // end stage
        
        stage('TAG IMAGE') {
            steps {
                sh 'docker tag zanma_back_courses:qa 314393745686.dkr.ecr.us-east-1.amazonaws.com/zanma-back-courses:qa'
            }
        } // end stage
        
        stage('PUSH IMAGE TO REGISTRY') {
            steps {
                sh 'docker push 314393745686.dkr.ecr.us-east-1.amazonaws.com/zanma-back-courses:qa'
            }
        } // end stage

    } // end stages
    
} // end pipeline