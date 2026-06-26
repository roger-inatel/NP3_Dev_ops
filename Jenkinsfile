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

    stage('Build Backend Image') {
      steps {
        sh 'docker build -t biblioteca-np3-backend:latest backend'
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
