// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BSON, ObjectId } from 'mongodb'

export interface IUser {
  _id?: BSON.ObjectId
  username: string
  password: string
}
