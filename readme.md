Transfer Service

Follow steps to start the server -
- npm install
- npm start

**Note** 

- Internally, we're using token to calling the account service APIs.
- You can configure the settings by edit the file config.ts.

**API exposed to User Side**

# POST http://localhost:5000/api/amount/transfer (default PORT 5000)

Transfer amount from source to destination and this service internally call account 
service's withdraw and deposit APIs.

# Location

**Method** | **Path**
---------- | -----------------
POST        | /api/amount/transfer

# Inputs

**Name**     | **Location** | **Type** | **Description**      | **Required**
------------ | ------------ | -------- | -------------------- | ----------------
Content-Type | header       | String   | application/json     | true
amount       | body         | Number   | amount to transfer   | true
sourceAccountNumber | body  | String   | source account number | true
destinationAccountNumber | body  | String   | destination account number | true
email                    | body  | String   | source account's email     | true


```javascript
POST api/amount/transfer
{
  "amount": 100000, 
  "sourceAccountNumber": "1000046134", 
  "destinationAccountNumber": "1000028587", 
  "email": "abc@gmail.co"
}
```

# Outputs

## Success

### HTTP Head

**Field**  | **Value**
---------- | ---------
status     | 200

### HTTP Body

**Name**      | **Type**                  | **Description**
------------- | ------------------------- | --------------------------------------
error         | Boolean                   | True, If there is any error otherwise false
message       | String                    | Success or failure message basis on the error 
data          | Object                    | User account details with number 

```javascript
{
    "data": {
        "accountNumber": "1000042202",
        "balance": "999900000.000",
        "email": "abc@gmail.com"
    },
    "error": false,
    "message": "Request successfully performed!!"
}
```
___
