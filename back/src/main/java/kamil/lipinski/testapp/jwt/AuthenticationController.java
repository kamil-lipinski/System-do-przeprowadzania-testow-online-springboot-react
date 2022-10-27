package kamil.lipinski.testapp.jwt;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import kamil.lipinski.testapp.appuser.AppUser;
import kamil.lipinski.testapp.appuser.AppUserRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {

    protected final Log logger = LogFactory.getLog(getClass());

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        String [] parameters = {"email", "password"};
        for(String i : parameters)
            if(JSON.get(i) == null) {
                responseMap.put("error", true);
                responseMap.put("message", "nie podano wszystkich wymaganych pol");
                ResponseEntity.status(500).body(responseMap);
            }
        String email = JSON.get("email").toString();
        String password = JSON.get("password").toString();
        try {
            Authentication auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email
                    , password));
            if (auth.isAuthenticated()) {
                logger.info("Logged In");
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                String token = jwtTokenUtil.generateToken(userDetails);
                responseMap.put("error", false);
                responseMap.put("message", "Logged In");
                responseMap.put("token", token);
                return ResponseEntity.ok(responseMap);
            } else {
                responseMap.put("error", true);
                responseMap.put("message", "Invalid Credentials");
                return ResponseEntity.status(401).body(responseMap);
            }
        } catch (DisabledException e) {
            e.printStackTrace();
            responseMap.put("error", true);
            responseMap.put("message", "User is disabled");
            return ResponseEntity.status(500).body(responseMap);
        } catch (BadCredentialsException e) {
            responseMap.put("error", true);
            responseMap.put("message", "Invalid Credentials");
            return ResponseEntity.status(401).body(responseMap);
        } catch (Exception e) {
            e.printStackTrace();
            responseMap.put("error", true);
            responseMap.put("message", "Something went wrong");
            return ResponseEntity.status(500).body(responseMap);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        String [] parameters = {"name", "surname", "email", "password", "isTeacher"};
        for(String i : parameters)
            if(JSON.get(i) == null) {
                responseMap.put("error", true);
                responseMap.put("massage", "nie podano wszystkich wymaganych pol");
                ResponseEntity.status(500).body(responseMap);
            }
        String name = JSON.get("name").toString();
        String surname = JSON.get("surname").toString();
        String email = JSON.get("email").toString();
        String password = JSON.get("password").toString();
        Boolean isTeacher = Boolean.valueOf(JSON.get("isTeacher").toString());

        AppUser newUser = appUserRepository.findAppUserByEmail(email);
        if(newUser != null) {
            responseMap.put("error", true);
            responseMap.put("message", "Uzytkownik o adresie email: "+email+" juz istnieje");
            return ResponseEntity.status(500).body(responseMap);
        }

        newUser = new AppUser(name, surname, email, new BCryptPasswordEncoder().encode(password), isTeacher);
        appUserRepository.save(newUser);
        responseMap.put("error", false);
        responseMap.put("message", "Konto zostalo utworzone pomyslnie");
        return ResponseEntity.ok(responseMap);
    }

}
