pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    options {
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES')
    }

    stages {

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Lint & Type Check') {
            steps {
                sh '''
                    npm run lint || true
                    npx tsc --noEmit
                '''
            }
        }

        stage('Prisma Generate') {
            steps {
                sh 'npx prisma generate'
            }
        }

        stage('Build (test only)') {
            steps {
                sh 'npm run build'
            }
        }
    }

    post {
        success {
            echo "✅ Code build thành công"
        }
        failure {
            echo "❌ Build thất bại - xem log tại ${BUILD_URL}"
        }
    }
}
