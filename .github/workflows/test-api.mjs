#!/usr/bin/env node

import axios from 'axios';
import { RugplayClient } from '../../dist/index.js';

(async () => {
  try {
    // Get public IP and ASN
    const ipRes = await axios.get('https://api.ipify.org?format=json');
    const ip = ipRes.data.ip;

    const asnRes = await axios.get(`https://ipinfo.io/${ip}/org`);
    const asn = asnRes.data;

    console.log(`Runner IP: ${ip}`);
    console.log(`ASN Info: ${asn}`);
  } catch (err) {
    console.error('ASN check failed:', err.message);
    process.exit(1);
  }

  const apiKey = process.env.TEST_API_KEY;
  if (!apiKey) {
    console.error('TEST_API_KEY not set');
    process.exit(1);
  }

  const client = new RugplayClient(apiKey);

  async function run() {
    try {
      console.log('Testing getTopCoins...');
      const top = await client.getTopCoins();
      if (!top.coins || !Array.isArray(top.coins)) throw new Error('Invalid top coins response');
      console.log('getTopCoins OK');

      console.log('Testing getMarketData...');
      const market = await client.getMarketData();
      if (!market.coins || !Array.isArray(market.coins)) throw new Error('Invalid market data response');
      console.log('getMarketData OK');

      if (market.coins.length > 0) {
        const symbol = market.coins[0].symbol;
        console.log('Testing getCoinDetails...');
        const details = await client.getCoinDetails(symbol);
        if (!details.coin) throw new Error('Invalid coin details response');
        console.log('getCoinDetails OK');

        console.log('Testing getCoinHolders...');
        const holders = await client.getCoinHolders(symbol);
        if (!holders.holders || !Array.isArray(holders.holders)) throw new Error('Invalid holders response');
        console.log('getCoinHolders OK');
      }

      console.log('Testing getHopium...');
      const hopium = await client.getHopium();
      if (!hopium.questions || !Array.isArray(hopium.questions)) throw new Error('Invalid hopium response');
      console.log('getHopium OK');

      if (hopium.questions.length > 0) {
        const qid = hopium.questions[0].id;
        console.log('Testing getHopiumDetails...');
        const hopiumDetails = await client.getHopiumDetails(qid);
        if (!hopiumDetails.question) throw new Error('Invalid hopium details response');
        console.log('getHopiumDetails OK');
      }

      console.log('All Rugplay API endpoint tests passed.');
    } catch (err) {
      console.error('Test failed:', err);
      process.exit(1);
    }
  }

  await run();
})();
