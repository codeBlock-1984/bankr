const authError = (useRoles) => {
  const userRolesLength = useRoles.length;
  if (userRolesLength === 1) {
    const role = useRoles[0];
    return `This request is exclusive to ${role}`;
  }
  if (userRolesLength === 2) {
    const roleOne = useRoles[0];
    const roleTwo = useRoles[1];
    return `This request is exclusive to ${roleOne} and ${roleTwo}`;
  }
};

export default authError;
