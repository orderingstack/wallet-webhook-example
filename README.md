# wallet-webhook-example
Working with Azure functions.

## devleopment
for using nodemon to restart local version when changing 
code use `npm start watch` and to start local instance:
`npm start:func`

You also need to add `local.settings.json ` file containing parameters (they need to be added to Azure func instance):
* TENANT - id of the tenant
* WALLET_USER_NAME - name of user with `WALLET API OPERATIONS` role
* WALLET_USER_PASS  - 
* BASE_URL - for test env: https://ordering.3e.pl
* BASIC_AUTH - example: b3JkZXJpbmc6c2VjcmV0


## testing 
you can use sample request in file:  rest\call-as-a-webhook.rest with REST plugin for vscode