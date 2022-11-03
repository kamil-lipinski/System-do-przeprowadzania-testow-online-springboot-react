package kamil.lipinski.testapp.pytanie;

import kamil.lipinski.testapp.uzytkownik.UzytkownikRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.test.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping(path="/pytanie")

public class PytanieController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private TestRepository testRepository;

    @Autowired
    private PytanieRepository pytanieRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @PostMapping(path="/stworz_pytanie")
    public ResponseEntity<?> addQuestion(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(!(uzytkownikRepository.findUzytkownikByEmail(authentication.getName()).isCzyNauczyciel())){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do dodawania pytań");
            return ResponseEntity.status(500).body(responseMap);
        }
        String [] parameters = {"testID", "tresc", "a", "aPoprawne", "b", "bPoprawne"};
        for(String i : parameters) {
            if (JSON.get(i) == null) {
                responseMap.put("error", true);
                responseMap.put("massage", "nie podano wszystkich wymaganych pol, nalezy podac przynajmniej 2 odpowiedzi");
                return ResponseEntity.status(500).body(responseMap);
            }
        }
        Long testID = Long.valueOf(JSON.get("testID").toString());
        if(!(testRepository.findTestByTestID(testID).getUzytkownik().getUzytkownikID().equals(uzytkownikRepository.findUzytkownikByEmail(authentication.getName()).getUzytkownikID()))){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do dodawania pytań do testu o id: "+testID);
            return ResponseEntity.status(500).body(responseMap);
        }
        int poprawne = 0;
        String tresc = JSON.get("tresc").toString();
        String a = JSON.get("a").toString();
        Boolean aPoprawne = Boolean.valueOf(JSON.get("aPoprawne").toString());
        String b = JSON.get("b").toString();
        Boolean bPoprawne = Boolean.valueOf(JSON.get("bPoprawne").toString());
        Pytanie nowePytanie = new Pytanie();
        nowePytanie.setTest(testRepository.findTestByTestID(testID));
        nowePytanie.setTresc(tresc);
        nowePytanie.setA(a);
        nowePytanie.setAPoprawne(aPoprawne);
        nowePytanie.setB(b);
        nowePytanie.setBPoprawne(bPoprawne);
        if(aPoprawne == true) poprawne++;
        if(bPoprawne == true) poprawne++;
        if(JSON.get("c") != null){
            nowePytanie.setC(JSON.get("c").toString());
            nowePytanie.setCPoprawne(Boolean.valueOf(JSON.get("cPoprawne").toString()));
            if(Boolean.valueOf(JSON.get("cPoprawne").toString()) == true) poprawne++;
        }
        if(JSON.get("d") != null){
            nowePytanie.setD(JSON.get("d").toString());
            nowePytanie.setDPoprawne(Boolean.valueOf(JSON.get("dPoprawne").toString()));
            if(Boolean.valueOf(JSON.get("dPoprawne").toString()) == true) poprawne++;
        }
        if(JSON.get("e") != null){
            nowePytanie.setE(JSON.get("e").toString());
            nowePytanie.setEPoprawne(Boolean.valueOf(JSON.get("ePoprawne").toString()));
            if(Boolean.valueOf(JSON.get("ePoprawne").toString()) == true) poprawne++;
        }
        if(JSON.get("f") != null){
            nowePytanie.setF(JSON.get("f").toString());
            nowePytanie.setFPoprawne(Boolean.valueOf(JSON.get("fPoprawne").toString()));
            if(Boolean.valueOf(JSON.get("fPoprawne").toString()) == true) poprawne++;
        }
        if(poprawne == 0){
            responseMap.put("error", true);
            responseMap.put("message", "co najmniej jedna odpowiedz musi byc poprawna");
            return ResponseEntity.status(500).body(responseMap);
        }
        pytanieRepository.save(nowePytanie);
        responseMap.put("error", false);
        responseMap.put("massage", "Pomyslnie dodano pytanie");
        return ResponseEntity.ok(responseMap);
    }
}
