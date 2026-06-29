pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Backend Dependencies') {
      steps {
        dir('backend') {
          sh 'npm install'
        }
      }
    }

    stage('Run Backend Tests') {
      steps {
        dir('backend') {
          sh 'npm test'
        }
      }
    }

    stage('Generate Coverage') {
      steps {
        dir('backend') {
          sh 'npm run test:coverage'
        }
      }
    }

    stage('Build and Push Backend Image') {
      steps {
        script {
          // O Jenkins vai procurar a credencial "docker-hub-credentials" que você criou na tela dele
          withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {

            //login no docker hub escondendo a senha
            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'

            sh 'docker build -t sn4r0/biblioteca-np3-backend:latest backend'
            sh 'docker push sn4r0/biblioteca-np3-backend:latest'
          }
        }
      }
    }

    stage('Build Frontend') {
      steps {
        dir('frontend') {
          sh 'npm install'
          sh 'npm run build'
        }
      }
    }

    stage('Archive Artifacts') {
      steps {
        archiveArtifacts artifacts: 'backend/coverage/**, frontend/dist/**', allowEmptyArchive: true
      }
    }

    stage('Notify By Email') {
      steps {
        script {
          env.BUILD_STATUS = currentBuild.currentResult ?: 'SUCCESS'
        }
        sh 'node scripts/send-email.js'
      }
    }
  }

  post {
    failure {
      script {
        env.BUILD_STATUS = currentBuild.currentResult ?: 'FAILURE'
      }
      sh 'node scripts/send-email.js'
    }
  }
}