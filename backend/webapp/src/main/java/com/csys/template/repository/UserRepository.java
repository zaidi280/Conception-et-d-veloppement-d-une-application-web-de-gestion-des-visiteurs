package com.csys.template.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.csys.template.domain.User;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long>{
	Optional<User> findByUsername(String username);

}
