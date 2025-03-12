import type { IUser } from './UserInterface'

export interface IAuthState {
  user: IUser | null
  token: string | null
}
