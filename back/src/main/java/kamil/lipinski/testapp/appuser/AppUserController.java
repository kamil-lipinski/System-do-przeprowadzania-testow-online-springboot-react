package kamil.lipinski.testapp.appuser;

import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.test.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path="/api")
public class AppUserController {

    @Autowired
    private AppUserRepository appUserRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @PostMapping(path="/createtest")
    public @ResponseBody ResponseEntity<?> createTest(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(appUserRepository.findAppUserByEmail(authentication.getName()).isTeacher())){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do tworzenia testow");
            return ResponseEntity.status(500).body(responseMap);
        }
        if(JSON.get("name") == null) {
            responseMap.put("error", true);
            responseMap.put("message", "nie podano nazwy");
            return ResponseEntity.status(500).body(responseMap);
        }
        String name = JSON.get("name").toString();
        String accesCode = RandomStringUtils.randomAlphanumeric(5);
        while(testRepository.findTestByAccesCode(accesCode) != null){
            accesCode = RandomStringUtils.randomAlphanumeric(5);
        }
        Test newTest = new Test(appUserRepository.findAppUserByEmail(authentication.getName()), name, accesCode);
        testRepository.save(newTest);
        responseMap.put("error", false);
        responseMap.put("message", "Test created successfully");
        return ResponseEntity.ok(responseMap);
    }


}
