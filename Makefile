BUCKET := ajs-cfn-us-east-2
STACK_NAME := home-iot
REGION := us-east-2

#.PHONY

all: package deploy

package:
	aws cloudformation package --template-file ./cfn-application.yaml --s3-bucket $(BUCKET) --output-template-file app-output.yaml --region $(REGION)

deploy:
	aws cloudformation deploy --template-file ./app-output.yaml --stack-name $(STACK_NAME) --capabilities CAPABILITY_IAM --region $(REGION)
