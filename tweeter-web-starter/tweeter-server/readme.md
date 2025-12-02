to update lambdas:

1. run `npm run build`

2. zip the contents of the dist folder into a zip file called `dist.zip`

3. move `dist.zip` into `tweeter-server`

4. run `./uploadLambdas.sh`

5. run `./updateLayers.sh`
