
export interface InviteBody {
  name: string
  email: string
  //   role: RoleType
  role: 'USER' | 'ADMIN'
}
