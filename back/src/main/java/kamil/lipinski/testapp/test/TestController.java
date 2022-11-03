package kamil.lipinski.testapp.test;

import kamil.lipinski.testapp.uzytkownik.UzytkownikRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.pytanie.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path="/test")
public class TestController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @PostMapping(path="/stworz_test")
    public @ResponseBody ResponseEntity<?> stworzTest(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(uzytkownikRepository.findUzytkownikByEmail(authentication.getName()).isCzyNauczyciel())){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do tworzenia testow");
            return ResponseEntity.status(500).body(responseMap);
        }
        if(JSON.get("nazwa") == null) {
            responseMap.put("error", true);
            responseMap.put("message", "nie podano nazwy");
            return ResponseEntity.status(500).body(responseMap);
        }
        String nazwa = JSON.get("nazwa").toString();
        String kodDostepu = RandomStringUtils.randomAlphanumeric(5);
        while(testRepository.findTestByKodDostepu(kodDostepu) != null){
            kodDostepu = RandomStringUtils.randomAlphanumeric(5);
        }
        Test nowyTest = new Test(uzytkownikRepository.findUzytkownikByEmail(authentication.getName()), nazwa, kodDostepu);
        testRepository.save(nowyTest);
        responseMap.put("error", false);
        responseMap.put("message", "Test utworzony pomyslnie");
        return ResponseEntity.ok(responseMap);
    }

}
