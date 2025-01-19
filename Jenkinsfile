@Library("shared-library@master") _

def isValid = true

pipeline {
    agent{
        label 'macos'
    }

	environment {
    	PATH = "/usr/local/bin:${env.PATH}"
    	USER = 'rwdevops999'
    	IMAGE = 'topfrontend'
  	}

	stages {
		stage("info") {
			steps {
			    sh 'node -v'
			    sh 'npm -v'
			}
		}

		stage("init") {
			steps {
				build job: 'DockerCompose', parameters: [string(name: 'COMPOSE', value: 'DOWN' )], wait: true 
			    sh 'npm ci'
			}

            post {
                failure {
                    script {
                        isValid = false
                    }
                }
            }
		}

        stage("build") {
            when {
                expression {
                    isValid
                }
            }

            steps {
                sh 'npm run build'
            }

            post {
                failure {
                    script {
                        isValid = false
                    }
                }
            }
        }

        stage("test") {
            when {
                expression {
                    isValid
                }
            }

            steps {
                sh '''
					more ./.env.tst
					cp .env.tst .env
					npx vitest --reporter=junit --outputFile=./test-results/test-result.xml
				'''
            }

            post {
			    success {
			        junit '**/test-results/**/*.xml'
			    }

				failure {
				    script {
    				    isValid = false
    				}
				}
			}
        }

        stage("package") {
            when {
                expression {
                    isValid
                }
            }

			environment {
			    DOCKERHUB_ACCESSKEY = credentials('DockerHubUserPassword')
			    KEYCHAIN_PSW = credentials('keychain')
			}

			steps {
				sh '''
					more .env.dev
					cp .env.dev .env
					security unlock-keychain -p ${KEYCHAIN_PSW}
					docker login -u ${DOCKERHUB_ACCESSKEY_USR} -p ${DOCKERHUB_ACCESSKEY_PSW}
					docker build . -t ${IMAGE}
				'''
			}
 
 			post {
			    failure {
			        script {
        			    isValid = false
        			}
			    }

			}
       }

       stage("publish") {
			when {
			    expression {
    			   isValid
    			}
			}

			steps {
				sh '''
					docker logout registry-1.docker.io
					docker tag ${IMAGE} ${USER}/${IMAGE}
					docker push ${USER}/${IMAGE}
				'''
			}

			post {
				success {
					sh '''
						docker rmi -f ${IMAGE}:latest
						docker rmi -f ${USER}/${IMAGE}:latest
					'''					
			        script {
        			    isValid = true
        			}
				}

				failure {
			        script {
        			    isValid = false
        			}
				}
			}
       }

		stage("finalize") {
			when {
		    	expression {
		        	isValid
    			}
		  	}

		  	steps {
				build job: 'DockerCompose', parameters: [string(name: 'COMPOSE', value: 'UP' )], wait: true 
		  	}
		}
    }

    post {
        success {
    	    mailTo(to: 'rudi.welter@gmail.com', attachLog: false)
        }

        failure {
	        mailTo(to: 'rudi.welter@gmail.com', attachLog: true)
        }
    }
}