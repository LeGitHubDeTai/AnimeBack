pipeline {
  agent {
    node {
      label 'Build'
    }

  }
  stages {
    stage('Install and Build') {
      steps {
        sh 'npm install'
        sh 'bash ./script/auto.sh'
      }
    }

  }
}