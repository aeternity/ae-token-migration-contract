# Aeternity token migration

## Tests

Tests are found in the `tests` directory and can be ran in docker via the
provided `docker-compose.yml`, which spins up a ganache instance as well.

```
$ docker-compose build tokenmigration-test && docker-compose up tokenmigration-test
```

Otherwise the tests can be invoked by the following command:

```
$ TESTHOST=localhost npm test
```


## Deploying to mainnet

The contract can either be deployed via truffle, which uses the `$LIVEHOST`
environment variable to set the endpoint for the live network, see also
`truffle.js`.

Alternatively, the `compile.js` script will generate calldata and a gas
estimate, which can then be used to deploy the contract via myetherwallet or
similar services. This script uses the `$WEB3_PROVIDER` environment variable.
It can be ran via

```
$ docker-compose build tokenmigration && TOKEN_CONTRACT_ADDRESS=0x0 MIGRATION_ADMIN_ADDRESS=0x0 WEB3_PROVIDER=https://mainnet.infura.io/v3/apikey docker-compose up tokenmigration
```
