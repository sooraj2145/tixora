
package com.tixora.backend.config;

import com.tixora.backend.entity.User;
import com.tixora.backend.repository.UserRepository;
import com.tixora.backend.service.JwtService;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    public JwtAuthenticationFilter(
            JwtService jwtService,
            UserRepository userRepository
    ) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

       String token = null;

       if(request.getCookies() != null) {
           for (jakarta.servlet.http.Cookie cookie : request.getCookies()) {
               if("TIXORA_AUTH".equals(cookie.getName())) {
                   token = cookie.getValue();
                   break;
               }
           }
       }



       if(token == null || token.isBlank()) {
           filterChain.doFilter(request, response);
           return;
       }

        try {
            String email = jwtService.extractEmail(token);

            if (SecurityContextHolder.getContext()
                    .getAuthentication() == null) {

                User user = userRepository.findByEmail(email)
                        .orElse(null);

                if (user == null) {
                    SecurityContextHolder.clearContext();
                    response.sendError(
                            HttpServletResponse.SC_UNAUTHORIZED,
                            "Invalid or expired JWT"
                    );
                    return;
                }

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                user.getEmail(),
                                null,
                                List.of(
                                        new SimpleGrantedAuthority(
                                                "ROLE_" + user.getRole().name()
                                        )
                                )
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request)
                );

                SecurityContextHolder.getContext()
                        .setAuthentication(authentication);
            }

        } catch (JwtException | IllegalArgumentException ex) {
            SecurityContextHolder.clearContext();
            response.sendError(
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Invalid or expired JWT"
            );
            return;
        }

        filterChain.doFilter(request, response);
    }
}
