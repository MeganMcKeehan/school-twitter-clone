to update lambdas:

1. run `npm run build`

2. zip the contents of the dist folder into a zip file called `dist.zip`

3. move `dist.zip` into `tweeter-server`

4. run `./uploadLambdas.sh`

if adding new lambda be sure to add it to `.server`

to update layers

1. put node_modules inside a folder called nodejs

2. zip folder

3. go to layers on aws and upload new layer (node20.x)

4. update the version number in `.server`

5. run `./updateLayers.sh`
