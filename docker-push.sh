#!/bin/bash

# Exit on any error
set -e

# Enable Docker BuildKit for faster, modern builds
export DOCKER_BUILDKIT=1

# Git operations - ensure we have latest code
echo "Checking out dev branch and pulling latest changes..."
git checkout dev
git pull origin dev

# Wait a moment to ensure git operations complete
sleep 2

TAG=$(date +%Y%m%d%H%M%S)
echo "Building Docker image with tag: $TAG (using BuildKit)"

# Build the Docker image with BuildKit
docker build --no-cache -t 869935105018.dkr.ecr.ap-south-1.amazonaws.com/front-end:$TAG .

# Push to ECR
echo "Pushing image to ECR..."
docker push 869935105018.dkr.ecr.ap-south-1.amazonaws.com/front-end:$TAG && echo "Push completed" || exit 1

echo "Pushed image: 869935105018.dkr.ecr.ap-south-1.amazonaws.com/front-end:$TAG"

# Update deployment.yaml with new tag
echo "Updating deployment.yaml with new tag: $TAG"
DEPLOYMENT_FILE="../../dply/stg/front-end/deployment.yaml"
if [ -f "$DEPLOYMENT_FILE" ]; then
    # Update the image tag in deployment.yaml
    sed -i "s|image: 869935105018.dkr.ecr.ap-south-1.amazonaws.com/front-end:[^[:space:]]*|image: 869935105018.dkr.ecr.ap-south-1.amazonaws.com/front-end:$TAG|g" "$DEPLOYMENT_FILE"
    echo "Updated deployment.yaml with tag: $TAG"
    
    # Apply the deployment from the deployment folder
    echo "Applying deployment to Kubernetes..."
    cd ../../dply/stg/front-end
    kubectl apply -f deployment.yaml -n pepagora-staging
    echo "Deployment applied successfully!"
    
    # Return to original directory
    cd ../../../compilers/FrontEnd
else
    echo "Warning: deployment.yaml not found at $DEPLOYMENT_FILE"
fi

# Clean up local image
docker rmi 869935105018.dkr.ecr.ap-south-1.amazonaws.com/front-end:$TAG
echo "Cleaned up local image: 869935105018.dkr.ecr.ap-south-1.amazonaws.com/front-end:$TAG"
