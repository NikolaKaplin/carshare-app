import compose from 'compose-function'
import { witDrizzleDb } from './with-drizzle-db'
import { witAuth } from './with-auth'
import { witRouting } from './with-routing'
import { witTheme } from './with-theme'

export const withProviders = compose(
    witDrizzleDb,
    witAuth,
    witRouting,
    witTheme,
)
