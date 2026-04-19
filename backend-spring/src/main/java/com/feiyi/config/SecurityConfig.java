package com.feiyi.config;

import com.feiyi.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.feiyi.repository.AdminUserRepository;
import java.util.Collections;

@Configuration
public class SecurityConfig {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            return adminUserRepository.findByUsername(username)
                    .map(admin -> new User(
                            admin.getUsername(),
                            admin.getPasswordHash(),
                            Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
                    ))
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(org.springframework.security.config.http.SessionCreationPolicy sessionPolicy) throws Exception {
        org.springframework.security.config.Customizer withHttpBasic = org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

        return new org.springframework.security.web.SecurityFilterChain.Builder()
                .authenticationProvider(authenticationProvider())
                .authorizeHttpRequests(req -> req
                        .requestMatchers("/api/auth/**", "/api/health").permitAll()
                        .anyRequest().authenticated()
                )
                .build();
    }
}
