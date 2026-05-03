import { Client, Account } from 'appwrite';

const client = new Client();

client
    .setEndpoint('https://sgp.cloud.appwrite.io/v1')
    .setProject('69f71fed003986eae8cf');

export const account = new Account(client);
export { ID } from 'appwrite';
