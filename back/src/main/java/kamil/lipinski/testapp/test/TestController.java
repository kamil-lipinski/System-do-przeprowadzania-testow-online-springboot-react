package kamil.lipinski.testapp.test;

import kamil.lipinski.testapp.pytanie.Pytanie;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.uzytkownik.*;
import kamil.lipinski.testapp.pytanie.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private PytanieRepository pytanieRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @PostMapping("/stworz_test")
    public @ResponseBody ResponseEntity<?> stworzTest(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(uzytkownikRepository.findUzytkownikByEmail(authentication.getName()).isCzyNauczyciel())){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do tworzenia testow");
            return ResponseEntity.status(500).body(responseMap);
        }
        String [] parameters = {"nazwa", "iloscPytan"};
        for(String i : parameters) {
            if (JSON.get(i) == null) {
                responseMap.put("error", true);
                responseMap.put("massage", "Nie podano wszystkich wymaganych pól");
                return ResponseEntity.status(500).body(responseMap);
            }
        }
        String nazwa = JSON.get("nazwa").toString();
        int iloscPytan = Integer.valueOf(JSON.get("iloscPytan").toString());
        String kodDostepu = RandomStringUtils.randomAlphanumeric(5);
        while(testRepository.findTestByKodDostepu(kodDostepu) != null){
            kodDostepu = RandomStringUtils.randomAlphanumeric(5);
        }
        Test nowyTest = new Test(uzytkownikRepository.findUzytkownikByEmail(authentication.getName()), nazwa, iloscPytan, kodDostepu);
        testRepository.save(nowyTest);
        responseMap.put("error", false);
        responseMap.put("message", "Test utworzony pomyslnie");
        return ResponseEntity.ok(responseMap);
    }

    @DeleteMapping("/usun_test/")
    public ResponseEntity<?> usunTest(@RequestParam(required = false) Long testID){
        Map<String, Object> responseMap = new HashMap<>();
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByTestID(testID);
        for(Pytanie i : pytania){
            pytanieRepository.delete(i);
        }
        testRepository.delete(testRepository.findTestByTestID(testID));
        responseMap.put("error", false);
        responseMap.put("message", "Pomyślnie usunieto test");
        return ResponseEntity.ok(responseMap);
    }

}
