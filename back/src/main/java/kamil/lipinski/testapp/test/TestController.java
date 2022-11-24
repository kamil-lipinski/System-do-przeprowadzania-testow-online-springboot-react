package kamil.lipinski.testapp.test;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.pula.Pula;
import kamil.lipinski.testapp.pula.PulaRepository;
import kamil.lipinski.testapp.pytanie.Pytanie;
import kamil.lipinski.testapp.pytanie.PytanieRepository;
import kamil.lipinski.testapp.uzytkownik.Uzytkownik;
import kamil.lipinski.testapp.uzytkownik.UzytkownikRepository;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private PulaRepository pulaRepository;

    @Autowired
    private PytanieRepository pytanieRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @PostMapping("/zaplanuj_test")
    public ResponseEntity<?> zaplanujTest(@RequestBody HashMap<String, Object> JSON){
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(!(uzytkownik.isCzyNauczyciel())){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do zaplanowania testu");
            return ResponseEntity.status(500).body(responseMap);
        }
        String [] parameters = {"pulaID", "data", "czas", "iloscPytan"};
        for(String i : parameters) {
            if (JSON.get(i) == null) {
                responseMap.put("error", true);
                responseMap.put("massage", "Nie podano wszystkich wymaganych pól");
                return ResponseEntity.status(500).body(responseMap);
            }
        }
        Long pulaID = Long.valueOf(JSON.get("pulaID").toString());
        String data = JSON.get("data").toString();
        int czas = Integer.valueOf(JSON.get("czas").toString());
        int iloscPytan = Integer.valueOf(JSON.get("iloscPytan").toString());
        String kodDostepu = RandomStringUtils.randomAlphanumeric(5);
        while(testRepository.findTestByKodDostepu(kodDostepu) != null){
            kodDostepu = RandomStringUtils.randomAlphanumeric(5);
        }
        Test nowyTest = new Test(pulaRepository.findPulaByPulaID(pulaID),data, czas, iloscPytan, kodDostepu);
        testRepository.save(nowyTest);
        responseMap.put("error", false);
        responseMap.put("message", "Pomyslnie zaplanowano test");
        return ResponseEntity.ok(responseMap);
    }

}
