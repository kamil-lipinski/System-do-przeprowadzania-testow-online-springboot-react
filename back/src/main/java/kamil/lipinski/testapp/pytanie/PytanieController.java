package kamil.lipinski.testapp.pytanie;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import kamil.lipinski.testapp.jwt.JwtUserDetailsService;
import kamil.lipinski.testapp.pula.*;
import kamil.lipinski.testapp.uzytkownik.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/pytanie")

public class PytanieController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private PulaRepository pulaRepository;

    @Autowired
    private PytanieRepository pytanieRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @PostMapping("/stworz_pytanie")
    public ResponseEntity<?> stworzPytanie(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(!(uzytkownik.isCzyNauczyciel())){
            responseMap.put("error", true);
            responseMap.put("message", "Użytkownik nie ma uprawnień do dodawania pytań");
            return ResponseEntity.status(500).body(responseMap);
        }
        String [] parameters = {"pulaID", "tresc", "a", "aPoprawne", "b", "bPoprawne"};
        for(String i : parameters) {
            if (JSON.get(i) == null) {
                responseMap.put("error", true);
                responseMap.put("message", "Nie podano wszystkich wymaganych pól, należy podać przynajmniej 2 odpowiedzi");
                return ResponseEntity.status(500).body(responseMap);
            }
        }
        Long pulaID = Long.valueOf(JSON.get("pulaID").toString());
        if(!(pulaRepository.findPulaByPulaID(pulaID).getUzytkownik().getUzytkownikID().equals(
                uzytkownik.getUzytkownikID()))){
            responseMap.put("error", true);
            responseMap.put("message", "Uzytkownik nie ma uprawnień do dodawania pytań do tego testu");
            return ResponseEntity.status(500).body(responseMap);
        }
        int poprawne = 0;
        String tresc = JSON.get("tresc").toString();
        String a = JSON.get("a").toString();
        Boolean aPoprawne = Boolean.valueOf(JSON.get("aPoprawne").toString());
        String b = JSON.get("b").toString();
        Boolean bPoprawne = Boolean.valueOf(JSON.get("bPoprawne").toString());
        Pytanie nowePytanie = new Pytanie();
        nowePytanie.setPula(pulaRepository.findPulaByPulaID(pulaID));
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
            responseMap.put("message", "Co najmniej jedna odpowiedź musi być poprawna");
            return ResponseEntity.status(500).body(responseMap);
        }
        pytanieRepository.save(nowePytanie);
        responseMap.put("error", false);
        responseMap.put("message", "Pomyślnie dodano pytanie");
        return ResponseEntity.ok(responseMap);
    }

    @GetMapping("/wyswietl_pytanie/")
    public ResponseEntity<?> wyswietlPytanie(@RequestParam Long pytanieID){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(pytanieRepository.findPytanieByPytanieID(pytanieID) == null){
            return ResponseEntity.notFound().build();
        }
        if(!(pytanieRepository.findPytanieByPytanieID(Long.valueOf(pytanieID)).getPula().getUzytkownik()
                .getUzytkownikID().equals(uzytkownik.getUzytkownikID()))){
            return ResponseEntity.notFound().build();
        }
        Pytanie pytanie = pytanieRepository.findPytanieByPytanieID(pytanieID);
        return ResponseEntity.ok(pytanie);
    }

    @PutMapping("/edytuj_pytanie/")
    public ResponseEntity<?> edytujPytanie(@RequestBody HashMap<String, Object> JSON, @RequestParam Long pytanieID){
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(pytanieRepository.findPytanieByPytanieID(pytanieID) == null){
            return ResponseEntity.notFound().build();
        }
        if(!(pytanieRepository.findPytanieByPytanieID(Long.valueOf(pytanieID)).getPula().getUzytkownik()
                .getUzytkownikID().equals(uzytkownik.getUzytkownikID()))){
            return ResponseEntity.notFound().build();
        }
        String [] parameters = {"tresc", "a", "aPoprawne", "b", "bPoprawne"};
        for(String i : parameters) {
            if (JSON.get(i) == null) {
                responseMap.put("error", true);
                responseMap.put("message", "Nie podano wszystkich wymaganych pól, należy podać przynajmniej 2 odpowiedzi");
                return ResponseEntity.status(500).body(responseMap);
            }
        }
        int poprawne = 0;
        String tresc = JSON.get("tresc").toString();
        String a = JSON.get("a").toString();
        Boolean aPoprawne = Boolean.valueOf(JSON.get("aPoprawne").toString());
        String b = JSON.get("b").toString();
        Boolean bPoprawne = Boolean.valueOf(JSON.get("bPoprawne").toString());
        Pytanie edytowanePytanie = pytanieRepository.findPytanieByPytanieID(pytanieID);
        edytowanePytanie.setTresc(tresc);
        edytowanePytanie.setA(a);
        edytowanePytanie.setAPoprawne(aPoprawne);
        edytowanePytanie.setB(b);
        edytowanePytanie.setBPoprawne(bPoprawne);
        if(aPoprawne == true) poprawne++;
        if(bPoprawne == true) poprawne++;
        if(JSON.get("c") != null){
            edytowanePytanie.setC(JSON.get("c").toString());
            edytowanePytanie.setCPoprawne(Boolean.valueOf(JSON.get("cPoprawne").toString()));
            if(Boolean.valueOf(JSON.get("cPoprawne").toString()) == true) poprawne++;
        }
        if(JSON.get("d") != null){
            edytowanePytanie.setD(JSON.get("d").toString());
            edytowanePytanie.setDPoprawne(Boolean.valueOf(JSON.get("dPoprawne").toString()));
            if(Boolean.valueOf(JSON.get("dPoprawne").toString()) == true) poprawne++;
        }
        if(JSON.get("e") != null){
            edytowanePytanie.setE(JSON.get("e").toString());
            edytowanePytanie.setEPoprawne(Boolean.valueOf(JSON.get("ePoprawne").toString()));
            if(Boolean.valueOf(JSON.get("ePoprawne").toString()) == true) poprawne++;
        }
        if(JSON.get("f") != null){
            edytowanePytanie.setF(JSON.get("f").toString());
            edytowanePytanie.setFPoprawne(Boolean.valueOf(JSON.get("fPoprawne").toString()));
            if(Boolean.valueOf(JSON.get("fPoprawne").toString()) == true) poprawne++;
        }
        if(poprawne == 0){
            responseMap.put("error", true);
            responseMap.put("message", "Co najmniej jedna odpowiedź musi byc poprawna");
            return ResponseEntity.status(500).body(responseMap);
        }
        pytanieRepository.save(edytowanePytanie);
        responseMap.put("error", false);
        responseMap.put("message", "Pomyslnie edytowano pytanie");
        return ResponseEntity.ok(responseMap);
    }

    @DeleteMapping("/usun_pytanie/")
    public ResponseEntity<?> usunPytanie(@RequestParam Long pytanieID){
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(pytanieRepository.findPytanieByPytanieID(pytanieID) == null){
            return ResponseEntity.notFound().build();
        }
        if(!(pytanieRepository.findPytanieByPytanieID(Long.valueOf(pytanieID)).getPula().getUzytkownik()
                .getUzytkownikID().equals(uzytkownik.getUzytkownikID()))){
            return ResponseEntity.notFound().build();
        }
        pytanieRepository.delete(pytanieRepository.findPytanieByPytanieID(pytanieID));
        responseMap.put("error", false);
        responseMap.put("message", "Pomyślnie usunieto pytanie");
        return ResponseEntity.ok(responseMap);
    }
}
