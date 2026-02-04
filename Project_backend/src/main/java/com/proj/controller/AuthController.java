package com.proj.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.proj.annotation.DotNetLog;
import com.proj.dto.AuthRequest;
import com.proj.dto.AuthResponse;
import com.proj.security.JwtUtils;
import com.proj.security.UserPrincipal;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private com.proj.repository.UserRepository userRepository;

    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @DotNetLog("Login attempt")
    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody AuthRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateToken(authentication);

            UserPrincipal userDetails = (UserPrincipal) authentication.getPrincipal();

            return ResponseEntity.ok(new AuthResponse(jwt,
                    userDetails.getEmail(),
                    userDetails.getUserRole(),
                    userDetails.getUserId()));
        } catch (org.springframework.security.authentication.BadCredentialsException e) {
            return ResponseEntity.status(401)
                    .body(new com.proj.dto.DeptResponseDTO("Login failed: Invalid email or password", "failed"));
        }
    }

    @DotNetLog("New User Registration Attempt")
    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody com.proj.entity.User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email is already taken!");
        }
        // Ensure ID is null so Hibernate treats it as a new record
        user.setId(null);
        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully! You can now sign in.");
    }
}
