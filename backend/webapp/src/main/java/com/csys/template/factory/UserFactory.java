package com.csys.template.factory;

import com.csys.template.domain.User;
import com.csys.template.dto.UserDTO;

public class UserFactory {

    public static UserDTO toDTO(User user) {
        if (user == null) return null;

        return new UserDTO(
            user.getId(),
            user.getUsername(),
            user.getRole()
        );
    }

    public static User toEntity(UserDTO dto) {
        if (dto == null) return null;

        User user = new User();
        user.setId(dto.getId());
        user.setUsername(dto.getUsername());
        user.setRole(dto.getRole());
        user.setPassword(dto.getPassword());
        return user;
    }
}
