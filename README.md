# rugpaly

API Wrapper for the RugPlay API

## Installation

```
npm install rugpaly
```

## Usage

```js
const RugpalyClient = require('rugpaly');
const client = new RugpalyClient('rgpl_your_api_key');

// Get top 50 coins
client.getTopCoins().then(console.log).catch(console.error);

// Get market data
client.getMarketData({ search: 'TEST', sortBy: 'marketCap', sortOrder: 'desc' })
  .then(console.log)
  .catch(console.error);

// Get coin details
client.getCoinDetails('TEST', '1h').then(console.log).catch(console.error);

// Get coin holders
client.getCoinHolders('TEST', 100).then(console.log).catch(console.error);

// Get prediction markets (hopium)
client.getHopium({ status: 'ACTIVE', page: 1, limit: 20 })
  .then(console.log)
  .catch(console.error);

// Get prediction market details
client.getHopiumDetails(101).then(console.log).catch(console.error);
```

## Error Handling

Errors from the RugPlay API are returned with descriptive messages, for example:

- `RugPlay API Responded with 429 - You are being rate limited`
- `RugPlay API Responded with 401 - Unauthorized (invalid or missing API key)`

## Endpoints

- `getTopCoins()` — Top 50 coins by market cap
- `getMarketData(params)` — Paginated market data (see API docs for params)
- `getCoinDetails(symbol, timeframe)` — Details for a specific coin
- `getCoinHolders(symbol, limit)` — Top holders for a coin
- `getHopium(params)` — Prediction markets
- `getHopiumDetails(questionId)` — Prediction market details

See [RugPlay API Documentation](https://rugplay.com/api) for more details.
