pipeline {
    agent any

    tools {
        nodejs 'node20'
    }

    options {
        disableConcurrentBuilds()
        timeout(time: 20, unit: 'MINUTES')
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

        stage('Build Docker Images') {
            steps {
                sh 'docker compose -f docker-compose.prod.yml --env-file .env.docker build'
            }
        }

        stage('Deploy (manual approval)') {
            steps {
                script {
                    input message: "Deploy bản mới lên production (port 8081 / 3001)?", ok: 'Approve'
                }
                sh 'docker compose -f docker-compose.prod.yml --env-file .env.docker up -d'
            }
        }
    }

    post {
        success {
            echo "✅ Build & Deploy thành công"
        }
        failure {
            echo "❌ Thất bại - xem log tại ${BUILD_URL}"
        }
    }
}
