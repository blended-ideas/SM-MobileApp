export class UserRoleInterface {
  name: string;
  label: string;
}

export class UserInterface {
  id: number;
  username: string;

  name: string;
  email: string;
  mobile_no: string;
  roles: UserRoleInterface[];
}
