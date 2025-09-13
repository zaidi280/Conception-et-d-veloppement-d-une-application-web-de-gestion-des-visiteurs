package com.csys.template.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.csys.template.domain.User;
import com.csys.template.dto.UserDTO;
import com.csys.template.factory.UserFactory;
import com.csys.template.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserDTO createUser(UserDTO userDTO, String rawPassword) {
    	 logger.info("💾 Saving user: {}", userDTO.getUsername());
        User user = UserFactory.toEntity(userDTO);
        user.setPassword(passwordEncoder.encode(rawPassword));
        return UserFactory.toDTO(userRepository.save(user));
    }

    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserFactory::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }
}
