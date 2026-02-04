package com.proj.security;

import com.proj.entity.User;
import com.proj.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.proj.repository.HrRepository hrRepository;

    @Autowired
    private com.proj.repository.EmpRepository empRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        Long departmentId = null;
        if (user.getRole() == com.proj.entity.Role.ROLE_HR) {
            departmentId = hrRepository.findByUser_Id(user.getId())
                    .map(hr -> hr.getDepartment().getDeptId())
                    .orElse(null);
        } else if (user.getRole() == com.proj.entity.Role.ROLE_EMPLOYEE) {
            departmentId = empRepository.findByUser_Id(user.getId())
                    .map(emp -> emp.getDepartment().getDeptId())
                    .orElse(null);
        }

        return UserPrincipal.create(user, departmentId);
    }
}
