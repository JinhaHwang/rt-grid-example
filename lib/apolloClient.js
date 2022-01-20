import fetch from 'isomorphic-unfetch'
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
import { WebSocketLink } from '@apollo/client/link/ws'
import { SubscriptionClient } from 'subscriptions-transport-ws'

let accessToken = null
const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST
const API_URL = process.env.NEXT_PUBLIC_API_URL
const API_WS_URL = process.env.NEXT_PUBLIC_API_WS_URL
const HASURA_ADMIN_SECRET = process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET

const requestAccessToken = async () => {
  if (accessToken) return

  const res = await fetch(`${APP_HOST}/api/session`)
  if (res.ok) {
    const json = await res.json()
    accessToken = json.accessToken
  } else {
    accessToken = 'public'
  }
}

// remove cached token on 401 from the server
const resetTokenLink = onError(({ networkError }) => {
  if (
    networkError &&
    networkError.name === 'ServerError' &&
    networkError.statusCode === 401
  ) {
    accessToken = null
  }
})

const createHttpLink = (headers) => {
  const httpLink = new HttpLink({
    uri: API_URL,
    credentials: 'include',
    headers, // auth token is fetched on the server side
    fetch,
  })
  return httpLink
}

const createWSLink = () => {
  return new WebSocketLink(
    new SubscriptionClient(API_WS_URL, {
      lazy: true,
      reconnect: true,
      connectionParams: async () => {
        // await requestAccessToken() // happens on the client
        return {
          headers: {
            authorization: accessToken ? `Bearer ${accessToken}` : '',
            'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
          },
        }
      },
    }),
  )
}

export default function createApolloClient(initialState, headers) {
  const ssrMode = typeof window === 'undefined'
  let link
  if (ssrMode) {
    link = createHttpLink(headers)
  } else {
    link = createWSLink()
  }
  return new ApolloClient({
    ssrMode,
    link,
    cache: new InMemoryCache().restore(initialState),
  })
}
