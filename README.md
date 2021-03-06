# ECHOLocator

Website to explore Choice Neighborhoods in the Boston area.

[![Build Status](https://travis-ci.org/azavea/echo-locator.svg?branch=develop)](https://travis-ci.org/azavea/echo-locator)

## Requirements

### To run within a Docker container:

* Docker Engine 17.06+
* Docker Compose 1.6+

### To run directly:

* node
* yarn


## Development

To start developing, create a set of Taui environment variables for development:

```
$ cp taui/configurations/default/env.yml.tmp taui/configurations/default/env.yml
```

Make sure to edit `env.yml` to set the appropriate secrets for development.

Next, move the AWS Amplify JavaScript configuration for the staging environment
into the Taui source code:

```
$ cp deployment/amplify/staging/aws-exports.js taui/src/aws-exports.js
```

### Optional step for local deployment

To deploy or manage deployment resources, on your host machine you will need to set up an `echo-locator` profile for the AWS account using the following command:
```bash
$ aws configure --profile echo-locator
```

### Running with Docker

Finally, use the `server` script to build container images, compile frontend assets,
and run a development server:

```
$ ./scripts/server
```

### Running directly

* `cd taui`
* Install packages: `yarn add`
* Build and run development server: `yarn start`


Navigate to http://localhost:9966 to view the development environment.

## Data

In the `neighborhood_data` directory are data sources and management scripts to transform them. The app uses two GeoJSON files generated by the scripts for neighborhood point and bounds data.

The two expected source files are:
 - `neighborhoods.csv`
 - `neighborhood_descriptions.csv`

Both contain zip code fields, which should be unique and appear in both files.

To run the data processing scripts and copy the output into the app directory:

 - `cd neighborhood_data`
 - `./update_data.sh`

The downloaded thumbnail images need to be deployed separately from the other app data.
To publish the neighborhood thumbnail images:

```
`./scripts/imagepublish ENVIRONMENT`
```

where `ENVIRONMENT` is either `staging` or `production`.


### About the data processing scripts

The `ecc_neighborhoods.csv` file is the primary source file for data on the neighborhoods, organized by zip code. `non_ecc_max_subsidies.csv` also contains non-ECC zipcodes, but does not contain the additional fields in `ecc_neighborhoods.csv`. The `add_non_ecc.py` script combines the two into `neighborhoods.csv`. The `add_zcta_centroids.py` script downloads Census Zip Code Tabulation Area (ZCTA) data, looks up the zip codes from `neighborhoods.csv`, and writes two files. One is `neighborhood_centroids.csv`, which is the input file content with two new columns added for the coordiates of the matching ZCTA's centroid (approximate center). The other is `neighborhood_bounds.json`, a GeoJSON file of the bounds of the ZCTAs marked as ECC in `neighborhoods.csv`.

The `fetch_images.py` script downloads metadata for and thumbnail versions of the image fields in `neighborhood_descriptions.csv` and appends fields with the metadata (to be used for attribution) to `neighborhood_extended_descriptions.csv`. This script only needs to be run if the images or their metadata need updating.

The `generate_neighborhood_json.py` script expects the `add_non_ecc`, `add_zcta_centroids.py`, and `fetch_images.py` scripts to have already been run. It transforms the `neighborhood_centroids.csv` data into GeoJSON, appends the description and image-related fields from `neighborhood_extended_descriptions.csv`, and writes the results to `neighborhoods.json`.


## Testing

Run linters and tests with the `test` script:

```
$ ./scripts/test
```

## Deployment

CI will deploy frontend assets to staging on commits to the `develop` branch,
and will deploy to production on commits to the `master` branch.

For instructions on how to update core infrastructure, see the [README in the
deployment directory](./deployment/README.md).

Note that the neighborhood thumbnail images are not deployed by CI, but need to be pushed manually after running the data processing script `fetch_images.py` that downloads them. See [the data section](#data) for more information.
