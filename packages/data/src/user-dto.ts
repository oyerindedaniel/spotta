import { UserDTO, UserDTOBase, UserDTOWithContact } from "@repo/types";

import { getCurrentUser } from "./auth";

interface GetUserParams {
  update?: boolean;
}

export async function getUserDTO(params: GetUserParams = {}): Promise<UserDTO> {
  const { update = false } = params;

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return null;
  }

  const baseDTO: UserDTOBase = {
    id: currentUser.id,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    picture: currentUser.picture,
  };

  if (update) {
    return {
      ...baseDTO,
      email: currentUser.email,
      phone: currentUser.phone,
    } as UserDTOWithContact;
  }

  return baseDTO;
}
