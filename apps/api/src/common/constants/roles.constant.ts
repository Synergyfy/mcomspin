export enum Role {
  SuperAdmin = 'SuperAdmin',
  BoroughAdmin = 'BoroughAdmin',
  HighStreetManager = 'HighStreetManager',
  BusinessOwner = 'BusinessOwner',
  Staff = 'Staff',
  Customer = 'Customer',
}

export const RoleHierarchy: Record<Role, number> = {
  [Role.SuperAdmin]: 100,
  [Role.BoroughAdmin]: 80,
  [Role.HighStreetManager]: 60,
  [Role.BusinessOwner]: 40,
  [Role.Staff]: 20,
  [Role.Customer]: 10,
};
