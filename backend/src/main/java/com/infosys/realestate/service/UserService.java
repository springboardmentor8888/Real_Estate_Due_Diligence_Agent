package com.infosys.realestate.service;

import com.infosys.realestate.dto.UserRequestDTO;
import com.infosys.realestate.dto.UserResponseDTO;

import java.util.List;

public interface UserService {

    UserResponseDTO createUser(UserRequestDTO userRequestDTO);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long userId);

    UserResponseDTO getUserByEmail(String email);

    void deleteUser(Long userId);
}
