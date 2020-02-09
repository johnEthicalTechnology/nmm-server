// DI stuff
import { container } from './inversify.config'
import { TYPES } from './inversifyTypes'
import { IServer } from './types'

const server = container.get<IServer>(TYPES.Server)

export const graphql = server.getApolloInstance().createHandler({
  cors: {
    origin: true,
    credentials: true
  }
})
