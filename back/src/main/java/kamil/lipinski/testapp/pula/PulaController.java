package kamil.lipinski.testapp.pula;

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
@RequestMapping("/pula")
public class PulaController {

    @Autowired
    private UzytkownikRepository uzytkownikRepository;

    @Autowired
    private PulaRepository pulaRepository;

    @Autowired
    private PytanieRepository pytanieRepository;

    @Autowired
    private JwtUserDetailsService userDetailsService;

    @PostMapping("/stworz_pule")
    public @ResponseBody ResponseEntity<?> stworzPule(@RequestBody HashMap<String, Object> JSON) {
        Map<String, Object> responseMap = new HashMap<>();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Uzytkownik uzytkownik = uzytkownikRepository.findUzytkownikByEmail(authentication.getName());
        if(!(uzytkownik.isCzyNauczyciel())){
            responseMap.put("error", true);
            responseMap.put("message", "uzytkownik nie ma uprawnien do tworzenia pul pytań");
            return ResponseEntity.status(500).body(responseMap);
        }
        if (JSON.get("nazwa") == null) {
            responseMap.put("error", true);
            responseMap.put("massage", "Nie podano nazwy testu");
            return ResponseEntity.status(500).body(responseMap);
        }
        String nazwa = JSON.get("nazwa").toString();
        Pula nowaPula = new Pula(uzytkownik, nazwa);
        pulaRepository.save(nowaPula);
        responseMap.put("error", false);
        responseMap.put("message", "Pula utworzona pomyslnie");
        return ResponseEntity.ok(responseMap);
    }

    @DeleteMapping("/usun_pule/")
    public ResponseEntity<?> usunPule(@RequestParam(required = false) Long pulaID){
        Map<String, Object> responseMap = new HashMap<>();
        ArrayList<Pytanie> pytania = pytanieRepository.findPytanieByPulaID(pulaID);
        for(Pytanie i : pytania){
            pytanieRepository.delete(i);
        }
        pulaRepository.delete(pulaRepository.findPulaByPulaID(pulaID));
        responseMap.put("error", false);
        responseMap.put("message", "Pomyślnie usunieto pulę pytań");
        return ResponseEntity.ok(responseMap);
    }

}
