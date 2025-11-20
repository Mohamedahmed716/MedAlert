package com.hospital.medalert.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    // These components are injected from the ApplicationConfig (to break the circular dependency)
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    /**
     * Custom Authentication Entry Point to handle PENDING accounts (DisabledException).
     * * When a user is found but their isActive=false (meaning isEnabled() is false),
     * Spring Security throws a DisabledException. We intercept this specific exception
     * and return a custom 403 Forbidden status and message.
     * This allows the Angular frontend to display "Account is pending" instead of "Invalid credentials."
     */
    @Bean
    public AuthenticationEntryPoint authenticationEntryPoint() {
        return (request, response, authException) -> {
            if (authException instanceof DisabledException) {
                // Action for Pending/Disabled Account: Return 403 Forbidden
                response.setStatus(HttpServletResponse.SC_FORBIDDEN); // HTTP Status 403
                response.setContentType("application/json");
                // Send specific message which Angular checks against (err.error?.message === 'ACCOUNT_PENDING')
                response.getWriter().write("{\"message\": \"ACCOUNT_PENDING\"}");
            } else {
                // Action for all other authentication failures (e.g., BadCredentialsException)
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized"); // HTTP Status 401
            }
        };
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Enable CORS and disable CSRF (essential for API communication from Angular)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            
            // 2. Define access rules (Authorization)
            .authorizeHttpRequests(auth -> auth
                // Allow all requests to the authentication endpoints (login/register)
                .requestMatchers("/api/v1/auth/**").permitAll()
                // All other API endpoints require a valid, non-expired token
                .anyRequest().authenticated()
            )
            
            // 3. Configure Exception Handling
            // Use the custom entry point we defined above to handle DisabledException (Pending status)
            .exceptionHandling(exception -> exception.authenticationEntryPoint(authenticationEntryPoint())) 
            
            // 4. Configure Session Management (Stateless JWT)
            // JWTs are stateless, so we tell Spring not to manage sessions
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // 5. Configure Authentication Providers
            .authenticationProvider(authenticationProvider)
            
            // 6. Add the JWT filter to run BEFORE Spring processes the username/password
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * CORS Configuration to allow communication from the Angular frontend (localhost:4200).
     */
    @Bean
    public UrlBasedCorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Allow Angular default port
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        // Allow necessary HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        // Allow Authorization header (for JWT) and Content-Type
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}