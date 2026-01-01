package com.example.ai_powered_document.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import com.example.ai_powered_document.model.User;
import com.example.ai_powered_document.repository.UserRepository;
import java.util.Optional;

import java.io.IOException;
import java.time.LocalDateTime;

@Component
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Value("${app.frontend.url}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        
        // Get user info from Google
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        
        System.out.println("OAuth login successful for: " + email);

        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        if (userOptional.isEmpty()) {
            System.out.println("Registering new user: " + email);

            user= new User();
            user.setUsername(email);
            user.setEmail(email);
            user.setOAuthUser(true);
            user.setOauthProvider("google");
            user.setCreatedAt(LocalDateTime.now());
            userRepository.save(user);
            System.out.println("New user registered: " + email);
        } else {
            user = userOptional.get();
            System.out.println("Existing user logged in: " + email);
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);
        
        // Generate JWT token
        String token = jwtUtil.generateToken(email);
        
        // Redirect to frontend with token
        String redirectUrl = frontendUrl + "/oauth-callback?token=" + token + "&username=" + email;
        
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
    }
}
