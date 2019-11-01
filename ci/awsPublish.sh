set -e
localPath="$1"
remotePath="$2"
fullRemotePath="s3://rapid-addition-distributions/$2"
if [ -z "$localPath" ]; then
    echo "Missing local path"
    exit 1
fi

if [ -z "$remotePath" ]; then
    echo "Missing remote path"
    exit 1
fi

export AWS_ACCESS_KEY_ID="$DIST_AWS_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$DIST_AWS_SECRET_ACCESS_KEY"

echo "Installing aws cli"
curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "/tmp/awscli-bundle.zip"
unzip /tmp/awscli-bundle.zip -d /tmp
/tmp/awscli-bundle/install -i /usr/local/aws -b /usr/local/bin/aws

echo "Upload to $fullRemotePath"
aws s3 cp "$localPath" "$fullRemotePath"